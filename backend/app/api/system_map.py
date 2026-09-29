from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SystemMetric, TransportMetric
from ..schemas import SystemMapResponse, SystemNodeSchema, SystemEdgeSchema

router = APIRouter()

@router.get("/system-map", response_model=SystemMapResponse)
def get_system_map(db: Session = Depends(get_db)):
    """
    Returns graph nodes and causal dependency edges between campus operational systems.
    """
    sys_metrics = {sm.system_name: sm for sm in db.query(SystemMetric).all()}
    t_metric = db.query(TransportMetric).order_by(TransportMetric.id.desc()).first()

    # Define Node Layout Coordinates and State
    nodes = [
        SystemNodeSchema(
            id="STUDENTS",
            label="STUDENT MOVEMENT",
            category="PRIMARY_INFLUX",
            load_pct=sys_metrics.get("STUDENTS").load_pct if "STUDENTS" in sys_metrics else 88.0,
            status="ELEVATED",
            pressure_active=True,
            position={"x": 100, "y": 240},
            metrics={"active_in_transit": 4250, "peak_window": "08:00 - 09:30", "arrival_rate": "+23% surge"}
        ),
        SystemNodeSchema(
            id="TRANSPORT",
            label="CAMPUS TRANSPORT",
            category="LOGISTICS",
            load_pct=t_metric.utilization_pct if t_metric else 91.0,
            status="CRITICAL",
            pressure_active=True,
            position={"x": 380, "y": 120},
            metrics={
                "active_buses": t_metric.active_buses if t_metric else 10,
                "avg_wait": f"{t_metric.avg_wait_min if t_metric else 18.4} min",
                "bottleneck_route": "Route 3 (97% load)",
                "overcrowding": f"{t_metric.overcrowding_pct if t_metric else 78}%"
            }
        ),
        SystemNodeSchema(
            id="CANTEEN",
            label="CANTEEN & DINING",
            category="AUXILIARY_SERVICE",
            load_pct=sys_metrics.get("CANTEEN").load_pct if "CANTEEN" in sys_metrics else 74.0,
            status="ELEVATED",
            pressure_active=True,
            position={"x": 680, "y": 140},
            metrics={"queue_wait": "14.2 min", "occupancy": "74%", "cascade_origin": "Transport delay wave"}
        ),
        SystemNodeSchema(
            id="LIBRARY",
            label="CENTRAL LIBRARY",
            category="STUDY_FACILITY",
            load_pct=sys_metrics.get("LIBRARY").load_pct if "LIBRARY" in sys_metrics else 96.0,
            status="CRITICAL",
            pressure_active=True,
            position={"x": 380, "y": 380},
            metrics={"occupancy": "96%", "seats_vacant": 16, "noise_index": "44.5 dB (Nominal)"}
        ),
        SystemNodeSchema(
            id="CLASSROOMS",
            label="CLASSROOMS & LABS",
            category="ACADEMIC",
            load_pct=sys_metrics.get("CLASSROOMS").load_pct if "CLASSROOMS" in sys_metrics else 62.0,
            status="NORMAL",
            pressure_active=False,
            position={"x": 680, "y": 360},
            metrics={"halls_active": "84 / 120", "lecture_sync": "Normal", "absenteeism_delay": "8.4% late"}
        ),
        SystemNodeSchema(
            id="NETWORK",
            label="CAMPUS NETWORK / IT",
            category="DIGITAL_INFRA",
            load_pct=sys_metrics.get("NETWORK").load_pct if "NETWORK" in sys_metrics else 68.0,
            status="NORMAL",
            pressure_active=False,
            position={"x": 920, "y": 240},
            metrics={"bandwidth": "1.4 Gbps", "latency": "14 ms", "ap_density": "Nominal"}
        ),
        SystemNodeSchema(
            id="FACILITIES",
            label="FACILITIES & ENERGY",
            category="PHYSICAL_INFRA",
            load_pct=sys_metrics.get("FACILITIES").load_pct if "FACILITIES" in sys_metrics else 45.0,
            status="NORMAL",
            pressure_active=False,
            position={"x": 920, "y": 420},
            metrics={"chiller_load": "45%", "grid_draw": "1.2 MW", "solar_contribution": "18%"}
        )
    ]

    # Directed Dependency Edges
    edges = [
        SystemEdgeSchema(
            id="e-students-transport",
            source="STUDENTS",
            target="TRANSPORT",
            label="Surge Influx (+23%)",
            animated=True,
            strength=0.95,
            is_bottleneck_path=True
        ),
        SystemEdgeSchema(
            id="e-transport-canteen",
            source="TRANSPORT",
            target="CANTEEN",
            label="Transit Delay -> Postponed Dining Wave",
            animated=True,
            strength=0.88,
            is_bottleneck_path=True
        ),
        SystemEdgeSchema(
            id="e-students-library",
            source="STUDENTS",
            target="LIBRARY",
            label="Mid-term Study Rush",
            animated=True,
            strength=0.92,
            is_bottleneck_path=True
        ),
        SystemEdgeSchema(
            id="e-transport-classrooms",
            source="TRANSPORT",
            target="CLASSROOMS",
            label="Arrival Delay (8.2 min)",
            animated=False,
            strength=0.65,
            is_bottleneck_path=False
        ),
        SystemEdgeSchema(
            id="e-canteen-facilities",
            source="CANTEEN",
            target="FACILITIES",
            label="Power & Kitchen HVAC Demand",
            animated=False,
            strength=0.50,
            is_bottleneck_path=False
        ),
        SystemEdgeSchema(
            id="e-library-network",
            source="LIBRARY",
            target="NETWORK",
            label="WiFi Concurrent Devices",
            animated=False,
            strength=0.72,
            is_bottleneck_path=False
        ),
        SystemEdgeSchema(
            id="e-classrooms-network",
            source="CLASSROOMS",
            target="NETWORK",
            label="Lecture Streams & LMS Sync",
            animated=False,
            strength=0.60,
            is_bottleneck_path=False
        )
    ]

    active_cascades = [
        "Student Arrival Spike (08:30) -> Transport Fleet Overload (91%)",
        "Route 3 Congestion (+18.4m wait) -> Delayed Campus Circulation",
        "Delayed Student Movement -> Secondary Central Canteen Congestion (+14.2m wait)"
    ]

    return SystemMapResponse(
        nodes=nodes,
        edges=edges,
        active_cascades=active_cascades,
        detected_pressures=3
    )
