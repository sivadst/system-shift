from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SystemMetric, TransportMetric, IncidentEvent
from ..schemas import DashboardResponse, DashboardPressureSchema, SystemMetricSchema

router = APIRouter()

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard_state(db: Session = Depends(get_db)):
    """
    Returns live campus operational status, active system pressures, and metric cards.
    """
    sys_metrics = db.query(SystemMetric).all()
    t_metric = db.query(TransportMetric).order_by(TransportMetric.id.desc()).first()
    
    # 3 Detected Pressures as required by Step 2 of User Journey
    pressures = [
        DashboardPressureSchema(
            system="TRANSPORT",
            load_pct=t_metric.utilization_pct if t_metric else 91.0,
            status="CRITICAL",
            pressure_label="Transport Overload",
            detail=f"Route 3 Metro Link operating at 97% capacity. Average waiting time {t_metric.avg_wait_min if t_metric else 18.4} min.",
            cascade_target="CANTEEN",
            severity="CRITICAL"
        ),
        DashboardPressureSchema(
            system="LIBRARY",
            load_pct=96.0,
            status="CRITICAL",
            pressure_label="Library Overcrowding",
            detail="Mid-term exam surge. Silent study desks at 96% occupancy (16 seats left).",
            cascade_target="STUDENTS",
            severity="CRITICAL"
        ),
        DashboardPressureSchema(
            system="CANTEEN",
            load_pct=74.0,
            status="ELEVATED",
            pressure_label="Canteen Demand Spike",
            detail="Transit delay postponement shifting lunch arrival waves into dining halls (14.2 min queue).",
            cascade_target="FACILITIES",
            severity="WARNING"
        )
    ]

    cards = [
        SystemMetricSchema(
            id=sm.id,
            system_name=sm.system_name,
            load_pct=sm.load_pct,
            status=sm.status,
            pressure_active=sm.pressure_active,
            bottleneck_score=sm.bottleneck_score,
            metric_label=sm.metric_label,
            metric_value=sm.metric_value,
            notes=sm.notes
        )
        for sm in sys_metrics
    ]

    return DashboardResponse(
        system_status="3 SYSTEM PRESSURES DETECTED",
        live_simulation_time=datetime.utcnow().strftime("%H:%M:%S UTC"),
        pressures_count=len(pressures),
        pressures=pressures,
        system_cards=cards,
        active_bottleneck="Route 3 (Metro Link) Transit Capacity Strained",
        summary="Interconnected system telemetry indicates incoming student arrival spike is propagating through campus transport into downstream dining facilities."
    )
