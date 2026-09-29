from typing import Dict, Any, List
from .schemas import MetricComparison, RouteSimImpact, SimulationResponse

# Baseline Campus Constants (Observed Ground Truth at Morning Peak 08:30)
BASELINE_BUSES = 10
BASELINE_FREQUENCY = 10.0  # minutes
BASELINE_DEMAND = 455       # students at peak
BASELINE_CAPACITY = 500     # 10 buses * 50 capacity
BASELINE_UTILIZATION = 91.0 # 455 / 500 = 91%
BASELINE_WAIT_MIN = 18.4
BASELINE_PEAK_WAIT_MIN = 26.5
BASELINE_OVERCROWDING_PCT = 78.0
BASELINE_DAILY_COST = 18400.0  # ₹18,400 / day
BASELINE_CANTEEN_SPIKE_DELAY = 18.0 # min delayed arrival

# Route configurations matching database seeded state
ROUTE_CONFIG = [
    {
        "code": "Route 1",
        "name": "Campus Circular",
        "base_buses": 3,
        "base_passengers": 122,
        "base_wait_min": 11.2,
        "stops": 8,
        "priority_rank": 3,
    },
    {
        "code": "Route 2",
        "name": "Hostel Express",
        "base_buses": 2,
        "base_passengers": 88,
        "base_wait_min": 14.5,
        "stops": 6,
        "priority_rank": 2,
    },
    {
        "code": "Route 3",
        "name": "Metro Rail Link (Critical)",
        "base_buses": 3,
        "base_passengers": 146,
        "base_wait_min": 24.8,
        "stops": 10,
        "priority_rank": 1,  # Primary bottleneck corridor
    },
    {
        "code": "Route 4",
        "name": "Research Park Shuttle",
        "base_buses": 2,
        "base_passengers": 68,
        "base_wait_min": 7.4,
        "stops": 5,
        "priority_rank": 4,
    },
]

def allocate_fleet_to_routes(active_buses: int, demand_multiplier: float = 1.0) -> Dict[str, int]:
    """
    Explicit operational fleet dispatch model.
    Allocates active buses across routes based on congestion pressure and corridor priority.
    At 10 buses: exactly reproduces baseline [3, 2, 3, 2] fleet allocation.
    When expanding (e.g. 10 -> 14 buses): deploys extra buses directly to highest-pressure routes (Route 3 first).
    """
    buses = {r["code"]: r["base_buses"] for r in ROUTE_CONFIG}
    base_passengers = {r["code"]: r["base_passengers"] for r in ROUTE_CONFIG}
    
    if active_buses > 10:
        for _ in range(active_buses - 10):
            # Prioritize route with highest projected load
            highest_route = max(
                buses.keys(),
                key=lambda code: (base_passengers[code] * demand_multiplier) / (buses[code] * 50)
            )
            buses[highest_route] += 1
    elif active_buses < 10:
        for _ in range(10 - active_buses):
            # Trim from lowest load route with more than 1 bus
            available_routes = [c for c in buses if buses[c] > 1]
            if available_routes:
                lowest_route = min(
                    available_routes,
                    key=lambda code: (base_passengers[code] * demand_multiplier) / (buses[code] * 50)
                )
                buses[lowest_route] -= 1
                
    return buses

def run_deterministic_simulation(
    active_buses: int,
    bus_frequency_min: float,
    student_demand_mod_pct: float,
    peak_window_min: int,
    scenario_name: str = "Simulated Scenario"
) -> SimulationResponse:
    """
    Deterministic campus transport simulation model.
    Models queuing physics, fleet cost structures, and cross-system cascading effects.
    Strictly calibrated to reproduce baseline ground truth (18.4 min wait, 78% overcrowding, ₹18,400 cost)
    when evaluated with baseline inputs (10 buses, 10 min frequency, 0% demand mod, 90 min peak window).
    """
    # 1. Total capacity & effective demand
    bus_unit_capacity = 50
    total_capacity = active_buses * bus_unit_capacity
    demand_multiplier = 1.0 + (student_demand_mod_pct / 100.0)
    effective_demand = BASELINE_DEMAND * demand_multiplier
    
    # 2. System utilization
    utilization_pct = min(150.0, round((effective_demand / max(1, total_capacity)) * 100.0, 1))
    
    # 3. Waiting time calculation: Headway arrival + non-linear congestion queue
    # Baseline (10 buses, 10 min headway, 91.0% utilization) -> exactly 18.4 min wait
    # Hero scenario (14 buses, 8 min headway, 65.0% utilization) -> exactly 7.4 min wait
    headway_wait = bus_frequency_min * 0.5
    
    if utilization_pct <= 60.0:
        congestion_delay = max(0.8, (utilization_pct / 60.0) * 2.2)
    elif utilization_pct <= 75.0:
        congestion_delay = 2.2 + ((utilization_pct - 60.0) / 15.0) * 3.5
    elif utilization_pct <= 91.0:
        # Calibrated queuing delay curve: exactly 13.4 min at 91.0% utilization
        congestion_delay = 5.7 + (((utilization_pct - 75.0) / 16.0) ** 1.35) * 7.7
    else:
        # Severe overflow above baseline 91.0%
        overflow = utilization_pct - 91.0
        congestion_delay = 13.4 + (overflow * 0.9)
        
    peak_window_factor = (peak_window_min / 90.0) ** 0.4
    avg_wait_min = round(max(3.0, (headway_wait + congestion_delay) * peak_window_factor), 1)
    peak_wait_min = round(avg_wait_min * (BASELINE_PEAK_WAIT_MIN / BASELINE_WAIT_MIN), 1)
    
    # 4. Overcrowding index
    # Baseline (91.0% utilization) -> exactly 78.0%
    # Hero scenario (65.0% utilization) -> exactly 27.5%
    if utilization_pct <= 60.0:
        overcrowding_pct = round(max(5.0, (utilization_pct / 60.0) * 20.0), 1)
    elif utilization_pct <= 70.0:
        overcrowding_pct = round(20.0 + ((utilization_pct - 60.0) / 10.0) * 15.0, 1)
    elif utilization_pct <= 91.0:
        # Calibrated: 35.0 + (21.0 / 21.0) * 43.0 = 78.0% at 91.0% utilization
        overcrowding_pct = round(35.0 + ((utilization_pct - 70.0) / 21.0) * 43.0, 1)
    else:
        overcrowding_pct = round(min(99.0, 78.0 + (utilization_pct - 91.0) * 1.5), 1)

    # 5. Operating Cost Calculation (INR)
    # Calibrated cost model:
    # Baseline (10 buses, 10 min frequency): 3980 + 10*1250 + 6*10*32 = ₹18,400 / day
    # Hero (14 buses, 8 min frequency): 3980 + 14*1250 + 7.5*14*32 = ₹24,840 / day (+₹6,440/day)
    fixed_depot_overhead = 3980.0
    active_bus_rate = active_buses * 1250.0  # Drivers, maintenance & depot support
    frequency_mileage = (60.0 / max(3.0, bus_frequency_min)) * active_buses * 32.0 # Fuel, wear & operational hours
    daily_operating_cost = round(fixed_depot_overhead + active_bus_rate + frequency_mileage, 0)

    # 6. Unmet demand & throughput
    throughput_per_hr = int(min(effective_demand, total_capacity) * (60.0 / bus_frequency_min) / 10.0)
    unmet_demand = max(0, int(effective_demand - total_capacity))

    # 7. Route-by-route impacts with dynamic operational allocation
    route_buses = allocate_fleet_to_routes(active_buses, demand_multiplier)
    route_impacts: List[RouteSimImpact] = []
    
    for r in ROUTE_CONFIG:
        code = r["code"]
        base_buses = r["base_buses"]
        base_cap = base_buses * 50
        base_passengers = r["base_passengers"]
        base_util = round((base_passengers / base_cap) * 100.0, 1)
        base_wait = r["base_wait_min"]
        
        sim_buses = route_buses[code]
        sim_cap = sim_buses * 50
        sim_demand = base_passengers * demand_multiplier
        sim_util = round((sim_demand / sim_cap) * 100.0, 1)
        
        # Route wait scales with headway adjustment and congestion curve relative to base
        headway_ratio = bus_frequency_min / BASELINE_FREQUENCY
        if sim_util <= 75.0:
            congestion_ratio = max(0.35, sim_util / base_util)
        else:
            congestion_ratio = (sim_util / base_util) ** 1.3
        
        sim_wait = round(max(2.5, base_wait * headway_ratio * congestion_ratio), 1)
        status = "HEALTHY" if sim_util < 75.0 else ("WARNING" if sim_util < 90.0 else "CRITICAL")
        
        route_impacts.append(RouteSimImpact(
            route_code=code,
            current_utilization=base_util,
            simulated_utilization=sim_util,
            current_wait=base_wait,
            simulated_wait=sim_wait,
            status=status
        ))

    # 8. Cascading cross-system impacts
    transit_delay_delta = avg_wait_min - BASELINE_WAIT_MIN
    canteen_delay_min = max(2.0, round(BASELINE_CANTEEN_SPIKE_DELAY + transit_delay_delta * 0.8, 1))
    canteen_peak_congestion_shift = (
        f"{'+' if transit_delay_delta > 0 else ''}{round(transit_delay_delta * 0.8, 1)} min arrival postponement"
        if abs(transit_delay_delta) >= 0.1 else "0.0 min arrival postponement (nominal)"
    )
    canteen_congestion_load = min(98.0, max(45.0, round(74.0 + (transit_delay_delta * 1.4), 1)))
    library_occupancy_sim = min(99.0, max(60.0, round(96.0 - (transit_delay_delta * 0.5), 1)))

    cascading_impact = {
        "transit_to_canteen_shift": canteen_peak_congestion_shift,
        "simulated_canteen_load_pct": canteen_congestion_load,
        "simulated_library_load_pct": library_occupancy_sim,
        "canteen_queue_estimate_min": canteen_delay_min,
        "cascade_summary": (
            f"Faster transit (avg wait {avg_wait_min}m) allows student cohorts to reach dining halls on regular schedule, avoiding compressed 13:00 canteen rushes."
            if transit_delay_delta < -0.1 else (
                f"Elevated transit delay (+{round(transit_delay_delta, 1)}m) clusters arriving students, creating a severe secondary dining queue bottleneck between 12:45-13:30."
                if transit_delay_delta > 0.1 else
                "Current transit queuing (18.4 min wait) propagates into downstream dining, shifting lunch arrival cohorts and sustaining 74% Canteen load."
            )
        )
    }

    # 9. Trade-off Engine (Strictly Non-Normative Description)
    diff_wait = round(avg_wait_min - BASELINE_WAIT_MIN, 1)
    diff_cost = round(daily_operating_cost - BASELINE_DAILY_COST, 0)
    diff_overcrowd = round(overcrowding_pct - BASELINE_OVERCROWDING_PCT, 1)
    diff_util = round(utilization_pct - BASELINE_UTILIZATION, 1)

    pct_diff_wait = round((diff_wait / BASELINE_WAIT_MIN) * 100.0, 1) if BASELINE_WAIT_MIN else 0.0
    pct_diff_cost = round((diff_cost / BASELINE_DAILY_COST) * 100.0, 1) if BASELINE_DAILY_COST else 0.0
    pct_diff_overcrowd = round((diff_overcrowd / BASELINE_OVERCROWDING_PCT) * 100.0, 1) if BASELINE_OVERCROWDING_PCT else 0.0
    pct_diff_util = round((diff_util / BASELINE_UTILIZATION) * 100.0, 1) if BASELINE_UTILIZATION else 0.0

    if abs(diff_wait) < 0.1 and abs(diff_cost) < 50 and abs(diff_overcrowd) < 0.1:
        trade_off_type = "BASELINE_OPERATIONAL_STATE"
        trade_off_title = "BASELINE GROUND TRUTH (08:30 PEAK)"
        trade_off_description = (
            "Active operational state: 10 buses at 10 min headway. System exhibits acute Route 3 bottleneck (97.3% load) and 18.4 min average wait time across 455 peak commuters."
        )
        human_decision_prompt = (
            "Baseline parameters currently active. The human operator can adjust fleet size, headway, or demand parameters to simulate trade-offs before executing changes."
        )
    elif diff_wait <= -1.0 and diff_cost > 600:
        trade_off_type = "TRADE_OFF_DETECTED"
        trade_off_title = "TRADE-OFF DETECTED"
        trade_off_description = (
            f"Lower waiting time (-{abs(diff_wait)} min / {abs(pct_diff_wait)}%) comes with higher operating cost (+₹{int(diff_cost):,}/day / +{pct_diff_cost}%). "
            f"Overcrowding drops by {abs(pct_diff_overcrowd)}%, but fleet operating budget increases."
        )
        human_decision_prompt = (
            f"This scenario reduces student waiting time from {BASELINE_WAIT_MIN} min to {avg_wait_min} min, but increases daily logistics expenditure by ₹{int(diff_cost):,}. "
            f"The human remains the decision-maker: Determine if service quality improvement outweighs the operating budget impact."
        )
    elif diff_wait >= 1.0 and diff_cost < -600:
        trade_off_type = "SERVICE_DEGRADED"
        trade_off_title = "BUDGET REDUCTION TRADE-OFF"
        trade_off_description = (
            f"Trims daily transport expenditure by ₹{int(abs(diff_cost)):,}/day (-{abs(pct_diff_cost)}%), but increases average student waiting time to {avg_wait_min} min (+{pct_diff_wait}%) and exacerbates corridor overcrowding."
        )
        human_decision_prompt = (
            f"This scenario saves ₹{int(abs(diff_cost)):,}/day in fleet operations, but increases student wait times by +{diff_wait} minutes. "
            f"The human remains the decision-maker: Determine whether fiscal savings warrant student transit delays and campus dissatisfaction."
        )
    elif diff_wait <= -0.5 and diff_cost <= 600:
        trade_off_type = "CAPACITY_IMPROVED"
        trade_off_title = "EFFICIENCY GAIN DETECTED"
        trade_off_description = (
            f"The scenario reduces congestion with negligible additional operating cost (+₹{int(diff_cost):,}/day). Waiting time improves by {abs(pct_diff_wait)}%."
        )
        human_decision_prompt = (
            f"Congestion is mitigated within existing cost boundaries. The human remains the decision-maker: Confirm fleet scheduling feasibility."
        )
    else:
        trade_off_type = "SYSTEM_PRESSURE_STABLE"
        trade_off_title = "OPERATIONAL REBALANCING"
        trade_off_description = (
            f"Metrics fluctuate marginally: wait time {avg_wait_min} min ({'+' if diff_wait>0 else ''}{diff_wait}m), cost ₹{int(daily_operating_cost):,}/day ({'+' if diff_cost>0 else ''}₹{int(diff_cost):,})."
        )
        human_decision_prompt = (
            f"Operational parameters produce marginal shifts. The human remains the decision-maker: Evaluate route-level bottlenecks."
        )

    comparisons: List[MetricComparison] = [
        MetricComparison(
            metric="Average Waiting Time",
            current_value=BASELINE_WAIT_MIN,
            simulated_value=avg_wait_min,
            unit="min",
            diff_abs=diff_wait,
            diff_pct=pct_diff_wait,
            direction="DOWN" if diff_wait < 0 else ("UP" if diff_wait > 0 else "NEUTRAL"),
            impact="POSITIVE" if diff_wait < 0 else ("NEGATIVE" if diff_wait > 0 else "NEUTRAL")
        ),
        MetricComparison(
            metric="Overcrowding Index",
            current_value=BASELINE_OVERCROWDING_PCT,
            simulated_value=overcrowding_pct,
            unit="%",
            diff_abs=diff_overcrowd,
            diff_pct=pct_diff_overcrowd,
            direction="DOWN" if diff_overcrowd < 0 else ("UP" if diff_overcrowd > 0 else "NEUTRAL"),
            impact="POSITIVE" if diff_overcrowd < 0 else ("NEGATIVE" if diff_overcrowd > 0 else "NEUTRAL")
        ),
        MetricComparison(
            metric="Fleet Utilization",
            current_value=BASELINE_UTILIZATION,
            simulated_value=utilization_pct,
            unit="%",
            diff_abs=diff_util,
            diff_pct=pct_diff_util,
            direction="DOWN" if diff_util < 0 else ("UP" if diff_util > 0 else "NEUTRAL"),
            impact="NEUTRAL" if diff_util == 0 else ("POSITIVE" if 60 <= utilization_pct <= 80 else "NEGATIVE")
        ),
        MetricComparison(
            metric="Daily Operating Cost",
            current_value=BASELINE_DAILY_COST,
            simulated_value=daily_operating_cost,
            unit="₹/day",
            diff_abs=diff_cost,
            diff_pct=pct_diff_cost,
            direction="UP" if diff_cost > 0 else ("DOWN" if diff_cost < 0 else "NEUTRAL"),
            impact="NEGATIVE" if diff_cost > 0 else ("POSITIVE" if diff_cost < 0 else "NEUTRAL")
        ),
        MetricComparison(
            metric="Peak Wait Time",
            current_value=BASELINE_PEAK_WAIT_MIN,
            simulated_value=peak_wait_min,
            unit="min",
            diff_abs=round(peak_wait_min - BASELINE_PEAK_WAIT_MIN, 1),
            diff_pct=round(((peak_wait_min - BASELINE_PEAK_WAIT_MIN) / BASELINE_PEAK_WAIT_MIN) * 100.0, 1),
            direction="DOWN" if peak_wait_min < BASELINE_PEAK_WAIT_MIN else ("UP" if peak_wait_min > BASELINE_PEAK_WAIT_MIN else "NEUTRAL"),
            impact="POSITIVE" if peak_wait_min < BASELINE_PEAK_WAIT_MIN else ("NEGATIVE" if peak_wait_min > BASELINE_PEAK_WAIT_MIN else "NEUTRAL")
        )
    ]

    return SimulationResponse(
        scenario_name=scenario_name,
        inputs={
            "active_buses": active_buses,
            "bus_frequency_min": bus_frequency_min,
            "student_demand_mod_pct": student_demand_mod_pct,
            "peak_window_min": peak_window_min,
            "total_capacity": total_capacity,
            "effective_demand": int(effective_demand)
        },
        current_state={
            "buses": BASELINE_BUSES,
            "frequency_min": BASELINE_FREQUENCY,
            "waiting_time_min": BASELINE_WAIT_MIN,
            "overcrowding_pct": BASELINE_OVERCROWDING_PCT,
            "utilization_pct": BASELINE_UTILIZATION,
            "daily_cost": BASELINE_DAILY_COST,
            "peak_wait_min": BASELINE_PEAK_WAIT_MIN
        },
        simulated_state={
            "buses": active_buses,
            "frequency_min": bus_frequency_min,
            "waiting_time_min": avg_wait_min,
            "overcrowding_pct": overcrowding_pct,
            "utilization_pct": utilization_pct,
            "daily_cost": daily_operating_cost,
            "peak_wait_min": peak_wait_min,
            "throughput_per_hr": throughput_per_hr,
            "unmet_demand": unmet_demand
        },
        comparisons=comparisons,
        trade_off_type=trade_off_type,
        trade_off_title=trade_off_title,
        trade_off_description=trade_off_description,
        human_decision_prompt=human_decision_prompt,
        route_impacts=route_impacts,
        cascading_impact=cascading_impact
    )

