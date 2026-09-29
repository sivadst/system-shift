import random
from datetime import datetime, timedelta
import math
from sqlalchemy.orm import Session
from sqlalchemy import text
from .models import (
    CampusLocation, BusRoute, Bus, SystemMetric, 
    TransportMetric, CanteenMetric, LibraryMetric, 
    ClassroomMetric, IncidentEvent
)
from .database import engine, Base

LOCATIONS_DATA = [
    {"code": "LOC-CTR", "name": "Campus Center Plaza", "category": "Academic", "capacity": 1200, "current_occupancy": 840, "status": "ELEVATED"},
    {"code": "LOC-MET", "name": "Metro Transit Hub", "category": "Transport", "capacity": 600, "current_occupancy": 582, "status": "CRITICAL"},
    {"code": "LOC-HST", "name": "South Hostel Complex", "category": "Residential", "capacity": 2500, "current_occupancy": 1100, "status": "NORMAL"},
    {"code": "LOC-CNT", "name": "Central Dining Hall", "category": "Dining", "capacity": 700, "current_occupancy": 518, "status": "ELEVATED"},
    {"code": "LOC-LIB", "name": "Central Science Library", "category": "Study", "capacity": 450, "current_occupancy": 432, "status": "CRITICAL"},
    {"code": "LOC-ENG", "name": "Engineering Block A", "category": "Academic", "capacity": 800, "current_occupancy": 496, "status": "NORMAL"},
    {"code": "LOC-RSH", "name": "Research & Tech Park", "category": "Research", "capacity": 500, "current_occupancy": 280, "status": "NORMAL"},
    {"code": "LOC-SRV", "name": "Datacenter & Server Room", "category": "Infrastructure", "capacity": 50, "current_occupancy": 12, "status": "NORMAL"},
]

ROUTES_DATA = [
    {"route_code": "Route 1", "name": "Campus Circular", "source": "Campus Center", "destination": "South Hostels", "stops_count": 8, "active_buses": 3, "capacity": 150, "current_passengers": 122, "utilization_pct": 81.3, "avg_wait_min": 11.2, "status": "WARNING", "delay_min": 3.4},
    {"route_code": "Route 2", "name": "Hostel Express", "source": "South Hostels", "destination": "Academic Quad", "stops_count": 6, "active_buses": 2, "capacity": 100, "current_passengers": 88, "utilization_pct": 88.0, "avg_wait_min": 14.5, "status": "WARNING", "delay_min": 5.1},
    {"route_code": "Route 3", "name": "Metro Rail Link (Critical)", "source": "Metro Transit Hub", "destination": "Engineering Quad", "stops_count": 10, "active_buses": 3, "capacity": 150, "current_passengers": 146, "utilization_pct": 97.3, "avg_wait_min": 24.8, "status": "CRITICAL", "delay_min": 12.6},
    {"route_code": "Route 4", "name": "Research Park Shuttle", "source": "Campus Center", "destination": "Research Park", "stops_count": 5, "active_buses": 2, "capacity": 100, "current_passengers": 68, "utilization_pct": 68.0, "avg_wait_min": 7.4, "status": "HEALTHY", "delay_min": 1.2},
]

BUSES_DATA = [
    {"bus_number": "BUS-101", "route_id": 1, "capacity": 50, "current_load": 42, "status": "IN_SERVICE", "driver_name": "R. Sharma", "current_stop": "Campus Center", "fuel_level_pct": 88.0},
    {"bus_number": "BUS-102", "route_id": 1, "capacity": 50, "current_load": 38, "status": "IN_SERVICE", "driver_name": "A. Verma", "current_stop": "Hostel Gate 2", "fuel_level_pct": 74.0},
    {"bus_number": "BUS-103", "route_id": 1, "capacity": 50, "current_load": 42, "status": "IN_SERVICE", "driver_name": "M. Khan", "current_stop": "Library Junction", "fuel_level_pct": 92.0},
    {"bus_number": "BUS-201", "route_id": 2, "capacity": 50, "current_load": 45, "status": "IN_SERVICE", "driver_name": "S. Patil", "current_stop": "South Quad", "fuel_level_pct": 65.0},
    {"bus_number": "BUS-202", "route_id": 2, "capacity": 50, "current_load": 43, "status": "IN_SERVICE", "driver_name": "P. Nair", "current_stop": "Dining Cross", "fuel_level_pct": 80.0},
    {"bus_number": "BUS-301", "route_id": 3, "capacity": 50, "current_load": 50, "status": "IN_SERVICE", "driver_name": "V. Reddy", "current_stop": "Metro Gate 1", "fuel_level_pct": 70.0},
    {"bus_number": "BUS-302", "route_id": 3, "capacity": 50, "current_load": 49, "status": "IN_SERVICE", "driver_name": "K. Singh", "current_stop": "Tech Enclave", "fuel_level_pct": 60.0},
    {"bus_number": "BUS-303", "route_id": 3, "capacity": 50, "current_load": 47, "status": "IN_SERVICE", "driver_name": "D. Joshi", "current_stop": "Engineering Cross", "fuel_level_pct": 85.0},
    {"bus_number": "BUS-401", "route_id": 4, "capacity": 50, "current_load": 35, "status": "IN_SERVICE", "driver_name": "H. Rao", "current_stop": "Research Block B", "fuel_level_pct": 90.0},
    {"bus_number": "BUS-402", "route_id": 4, "capacity": 50, "current_load": 33, "status": "IN_SERVICE", "driver_name": "T. Sen", "current_stop": "Innovation Lab", "fuel_level_pct": 78.0},
]

def seed_initial_state(db: Session):
    """Seed campus baseline locations, routes, and active metrics."""
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # 1. Locations
    if db.query(CampusLocation).count() == 0:
        for loc in LOCATIONS_DATA:
            db.add(CampusLocation(
                code=loc["code"],
                name=loc["name"],
                category=loc["category"],
                capacity=loc["capacity"],
                current_occupancy=loc["current_occupancy"],
                utilization_pct=round((loc["current_occupancy"] / loc["capacity"]) * 100.0, 1),
                status=loc["status"]
            ))
        db.commit()

    # 2. Routes
    if db.query(BusRoute).count() == 0:
        for r in ROUTES_DATA:
            db.add(BusRoute(**r))
        db.commit()

    # 3. Buses
    if db.query(Bus).count() == 0:
        for b in BUSES_DATA:
            db.add(Bus(**b))
        db.commit()

    # 4. System Metrics
    if db.query(SystemMetric).count() == 0:
        metrics = [
            SystemMetric(system_name="TRANSPORT", load_pct=91.0, status="CRITICAL", pressure_active=True, bottleneck_score=9.4, metric_label="Fleet Utilization", metric_value="91% (18.4 min wait)", notes="Severe bottleneck on Route 3 from Metro Hub. Demand exceeded capacity by 23%."),
            SystemMetric(system_name="LIBRARY", load_pct=96.0, status="CRITICAL", pressure_active=True, bottleneck_score=8.8, metric_label="Seat Occupancy", metric_value="96% (16 seats left)", notes="Mid-term exam surge. Silent study zones at 100% capacity."),
            SystemMetric(system_name="CANTEEN", load_pct=74.0, status="ELEVATED", pressure_active=True, bottleneck_score=7.2, metric_label="Dining Queue Wait", metric_value="74% (14.2 min wait)", notes="Transit delay postponed arrival wave, creating condensed dining congestion."),
            SystemMetric(system_name="NETWORK", load_pct=68.0, status="NORMAL", pressure_active=False, bottleneck_score=3.1, metric_label="Campus WiFi Bandwidth", metric_value="68% (1.4 Gbps)", notes="Operating within healthy thresholds."),
            SystemMetric(system_name="CLASSROOMS", load_pct=62.0, status="NORMAL", pressure_active=False, bottleneck_score=2.5, metric_label="Lecture Hall Use", metric_value="62% (84/120 halls)", notes="Morning lectures underway, attendance stable."),
            SystemMetric(system_name="FACILITIES", load_pct=45.0, status="NORMAL", pressure_active=False, bottleneck_score=1.8, metric_label="HVAC & Power Load", metric_value="45% nominal", notes="Substations and chillers operating normally."),
            SystemMetric(system_name="STUDENTS", load_pct=88.0, status="ELEVATED", pressure_active=False, bottleneck_score=6.9, metric_label="Active In-Transit", metric_value="4,250 on campus", notes="Morning arrival flow peaking across main transit nodes.")
        ]
        for m in metrics:
            db.add(m)
        db.commit()

    # 5. Live Transport Metric
    if db.query(TransportMetric).count() == 0:
        db.add(TransportMetric(
            active_buses=10,
            total_capacity=500,
            current_demand=455,
            utilization_pct=91.0,
            avg_wait_min=18.4,
            peak_wait_min=26.5,
            overcrowding_pct=78.0,
            daily_cost=18400.0,
            delayed_passengers=142
        ))
        db.commit()

def generate_100k_synthetic_events(db: Session, target_count: int = 100_000):
    """
    Generate at least 100,000 realistic campus operational events spanning 30 days.
    Uses ultra-fast raw SQLite bulk insertion with realistic diurnal cycles and anomalies.
    """
    current_count = db.query(IncidentEvent).count()
    if current_count >= target_count:
        return current_count

    print(f"[DATA GENERATOR] Generating {target_count} synthetic campus event records across 30 days...")
    
    systems = ["TRANSPORT", "CANTEEN", "LIBRARY", "NETWORK", "FACILITIES", "CLASSROOMS", "STUDENTS"]
    locations = [
        "Metro Transit Hub", "Campus Center Plaza", "Central Dining Hall",
        "Central Science Library", "Engineering Block A", "South Hostel Complex",
        "Research & Tech Park", "North Gate Depot"
    ]

    event_templates = {
        "TRANSPORT": [
            ("Peak arrival congestion detected at platform", "HIGH", "Transit platform waiting line exceeds capacity during commuter surge."),
            ("Route 3 headway stretched due to traffic at Metro junction", "HIGH", "Bus cycle delayed by 12 minutes, passenger queue accumulating."),
            ("Bus 301 passenger capacity reached at stop 2", "MEDIUM", "Standing room only. Subsequent boarding passengers deferred to Bus 302."),
            ("Route 1 campus loop delay cleared", "LOW", "Circulation normalized around academic quad."),
            ("Bus 104 scheduled maintenance turnaround completed", "LOW", "Vehicle cleared for evening shuttle service."),
            ("Transit bottleneck cascade alert: Route 3 -> Central Canteen", "CRITICAL", "Delayed morning transit wave shifts dining peak arrival by 22 minutes."),
            ("Fleet utilization crossed 90% threshold", "CRITICAL", "Total active capacity strained. Queue build-up at Metro Hub."),
            ("Bus stop shelter crowd sensor reached warning level", "MEDIUM", "Turnstile flow rate throttled to maintain safety clearance.")
        ],
        "CANTEEN": [
            ("Dining hall service queue exceeds 12 minutes", "MEDIUM", "Primary counter throughput saturated during delayed lunch surge."),
            ("Beverage station restocking triggered", "LOW", "Automatic dispenser refilled by catering logistics."),
            ("Seating capacity crossed 80% mark in East Wing", "MEDIUM", "Secondary overflow dining area unlocked for students."),
            ("Canteen entry turnstile sensor latency spike", "LOW", "Card reader synchronization stabilized after 45 seconds."),
            ("Dining hall surge correlated with delayed Route 3 bus arrival", "HIGH", "Sudden arrival of 140 passengers creating localized queue pressure.")
        ],
        "LIBRARY": [
            ("Science Library quiet study zone reached 98% occupancy", "HIGH", "All single cubicles occupied; group rooms queued."),
            ("Book checkout RFID scanner momentary offline", "LOW", "Fallback barcode scanning active, resolved in 3 mins."),
            ("Library WiFi AP 4B client density critical", "MEDIUM", "180 concurrent devices connected to single access point."),
            ("Silent floor acoustic threshold violation detected", "LOW", "Sound monitor registered 54dB, automatic alert sent to desk.")
        ],
        "NETWORK": [
            ("Campus core switch packet latency momentary rise", "LOW", "Burst traffic resolved after DNS cache rebalance."),
            ("Hostel Block WiFi gateway bandwidth saturation", "MEDIUM", "Evening streaming bandwidth capped per QoS policy."),
            ("Eduroam authentication cluster failover test successful", "LOW", "Routine scheduled protocol test."),
            ("Optical link jitter between Data Center and Engineering", "MEDIUM", "Re-routed through secondary dark fiber loop.")
        ],
        "FACILITIES": [
            ("HVAC chiller 2 cooling load adjusted for heatwave", "LOW", "Thermal regulation running at 68% power."),
            ("Elevator 3 in Engineering Block door sensor warning", "MEDIUM", "Maintenance team notified, preventative check logged."),
            ("Solar canopy micro-inverter grid feed optimal", "LOW", "Producing 42 kW into campus distribution board.")
        ],
        "CLASSROOMS": [
            ("Lecture Hall C101 multimedia projector sync delay", "LOW", "Audio-visual connection reset, lecture resumed."),
            ("Mid-term examination room check-in completed", "LOW", "240 students seated in Hall A.")
        ],
        "STUDENTS": [
            ("High pedestrian flux registered at North Walkway", "MEDIUM", "Class transition wave moving between Science and Arts."),
            ("Turnstile egress surge following morning lecture dismissal", "MEDIUM", "Egress corridor operating smoothly.")
        ]
    }

    # Reference time: today 09:00 AM
    now = datetime.utcnow()
    records_to_generate = target_count - current_count
    batch_size = 10_000
    
    # We will generate raw SQL tuples for speed
    insert_sql = """
    INSERT INTO incidents (timestamp, title, description, system_affected, severity, location, resolved, impact_summary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """
    
    conn = engine.raw_connection()
    cursor = conn.cursor()

    try:
        generated = 0
        while generated < records_to_generate:
            current_batch = min(batch_size, records_to_generate - generated)
            batch_data = []

            for _ in range(current_batch):
                # Spread across last 30 days
                days_ago = random.uniform(0.0, 30.0)
                event_time = now - timedelta(days=days_ago)
                hour = event_time.hour + (event_time.minute / 60.0)

                # Diurnal probability weighting:
                # 08:00-09:30 morning peak (transport high)
                # 12:00-14:00 lunch peak (canteen high)
                # 15:00-18:00 study peak (library high)
                # 17:30-19:30 evening transit peak
                if 7.5 <= hour <= 9.5:
                    weights = [0.45, 0.08, 0.12, 0.10, 0.05, 0.10, 0.10]
                elif 11.5 <= hour <= 14.0:
                    weights = [0.15, 0.45, 0.15, 0.10, 0.05, 0.05, 0.05]
                elif 14.5 <= hour <= 18.0:
                    weights = [0.15, 0.10, 0.40, 0.15, 0.05, 0.10, 0.05]
                elif 18.0 <= hour <= 20.5:
                    weights = [0.40, 0.15, 0.20, 0.15, 0.05, 0.02, 0.03]
                else:
                    weights = [0.15, 0.10, 0.15, 0.25, 0.15, 0.10, 0.10]

                system = random.choices(systems, weights=weights)[0]
                template_tuple = random.choice(event_templates[system])
                title, base_severity, desc = template_tuple
                
                # Introduce occasional severity shifts
                severity = base_severity
                if random.random() < 0.05:
                    severity = "CRITICAL"
                elif random.random() < 0.15:
                    severity = "HIGH"

                location = random.choice(locations)
                if system == "TRANSPORT":
                    location = random.choice(["Metro Transit Hub", "North Gate Depot", "South Hostel Complex"])
                elif system == "CANTEEN":
                    location = "Central Dining Hall"
                elif system == "LIBRARY":
                    location = "Central Science Library"

                resolved = (days_ago > 0.2) or (random.random() > 0.3)
                impact = f"Observed operational metric variation during {'peak' if (8 <= hour <= 18) else 'off-peak'} window."

                batch_data.append((
                    event_time.strftime("%Y-%m-%d %H:%M:%S"),
                    title,
                    desc,
                    system,
                    severity,
                    location,
                    1 if resolved else 0,
                    impact
                ))

            cursor.executemany(insert_sql, batch_data)
            conn.commit()
            generated += current_batch

        # Inject the Master Scenario anchor incident at 08:30 AM today!
        today_0830 = (now.replace(hour=8, minute=30, second=0)).strftime("%Y-%m-%d %H:%M:%S")
        anchor_events = [
            (today_0830, "TRANSPORT OVERLOAD: Route 3 Metro Corridor", "Demand surged 23% between 08:00 and 09:00 while available capacity decreased 8%. Route 3 is operating at 97% utilization and contributes most of the current pressure.", "TRANSPORT", "CRITICAL", "Metro Transit Hub", 0, "Average student wait time reached 18.4 min (peak 26.5 min). 142 students delayed."),
            (today_0830, "SYSTEM CASCADE: Delayed Transit Waves Shifting Canteen Rush", "Late morning arrival clusters predict secondary queuing congestion at Central Dining Hall between 12:45-13:30.", "CANTEEN", "HIGH", "Central Dining Hall", 0, "Estimated dining queue backlog +14 min."),
            (today_0830, "CAPACITY STRAIN: Central Library Study Desks Nearing Saturation", "Mid-term study demand combined with delayed student movement has concentrated occupancy at 96%.", "LIBRARY", "CRITICAL", "Central Science Library", 0, "Only 16 seats remaining across 3 floors.")
        ]
        cursor.executemany(insert_sql, anchor_events)
        conn.commit()

        print(f"[DATA GENERATOR] Successfully populated {generated} events into database! Total count now >= 100,000.")
    finally:
        cursor.close()
        conn.close()

    return db.query(IncidentEvent).count()
