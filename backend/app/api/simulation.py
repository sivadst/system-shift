import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SimulationScenario
from ..schemas import SimulationRequest, SimulationResponse
from ..simulation import run_deterministic_simulation

router = APIRouter()

PRESETS = [
    {
        "id": "hero_add_4_buses",
        "name": "Add 4 Peak Buses (Hero Scenario)",
        "description": "Increases active fleet from 10 to 14 buses and tightens frequency to 8 min to alleviate Route 3 bottleneck.",
        "active_buses": 14,
        "bus_frequency_min": 8.0,
        "student_demand_mod_pct": 0.0,
        "peak_window_min": 90
    },
    {
        "id": "high_demand_surge",
        "name": "Mid-term Influx Surge (+25% Demand)",
        "description": "Simulate student arrival surge without increasing fleet capacity to test critical system breaking point.",
        "active_buses": 10,
        "bus_frequency_min": 10.0,
        "student_demand_mod_pct": 25.0,
        "peak_window_min": 120
    },
    {
        "id": "fleet_trim",
        "name": "Budget Fleet Trim (8 Buses)",
        "description": "Reduces active fleet to 8 buses to assess cost reduction vs student transit delays.",
        "active_buses": 8,
        "bus_frequency_min": 12.0,
        "student_demand_mod_pct": 0.0,
        "peak_window_min": 90
    },
    {
        "id": "rapid_transit_surge",
        "name": "High-Frequency Metro Corridor (18 Buses)",
        "description": "Maximizes platform throughput with 18 buses at 5 min frequency.",
        "active_buses": 18,
        "bus_frequency_min": 5.0,
        "student_demand_mod_pct": 10.0,
        "peak_window_min": 90
    }
]

@router.get("/simulation/presets")
def get_simulation_presets():
    """Returns curated operational scenarios for one-click testing."""
    return PRESETS

@router.post("/simulation", response_model=SimulationResponse)
def execute_simulation(req: SimulationRequest, db: Session = Depends(get_db)):
    """
    Executes a deterministic operational simulation and logs scenario results to database.
    """
    response = run_deterministic_simulation(
        active_buses=req.active_buses,
        bus_frequency_min=req.bus_frequency_min,
        student_demand_mod_pct=req.student_demand_mod_pct,
        peak_window_min=req.peak_window_min,
        scenario_name=req.scenario_name or "Custom Scenario"
    )

    # Persist scenario to DB
    scenario_record = SimulationScenario(
        scenario_name=response.scenario_name,
        active_buses=req.active_buses,
        bus_frequency_min=req.bus_frequency_min,
        student_demand_mod_pct=req.student_demand_mod_pct,
        peak_window_min=req.peak_window_min,
        baseline_wait_min=response.current_state["waiting_time_min"],
        simulated_wait_min=response.simulated_state["waiting_time_min"],
        baseline_overcrowding_pct=response.current_state["overcrowding_pct"],
        simulated_overcrowding_pct=response.simulated_state["overcrowding_pct"],
        baseline_utilization_pct=response.current_state["utilization_pct"],
        simulated_utilization_pct=response.simulated_state["utilization_pct"],
        baseline_daily_cost=response.current_state["daily_cost"],
        simulated_daily_cost=response.simulated_state["daily_cost"],
        throughput_per_hr=response.simulated_state["throughput_per_hr"],
        unmet_demand_count=response.simulated_state["unmet_demand"],
        trade_off_type=response.trade_off_type,
        trade_off_summary=response.trade_off_description,
        details_json=json.dumps({
            "comparisons": [c.dict() for c in response.comparisons],
            "cascading_impact": response.cascading_impact
        })
    )
    db.add(scenario_record)
    db.commit()

    return response

@router.get("/simulation/{id}")
def get_saved_simulation(id: int, db: Session = Depends(get_db)):
    """Retrieve historical simulation scenario from database."""
    scenario = db.query(SimulationScenario).filter(SimulationScenario.id == id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Simulation scenario not found")
    return scenario
