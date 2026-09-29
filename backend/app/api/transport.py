from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import BusRoute, Bus, TransportMetric
from ..schemas import TransportOverviewResponse, BusRouteSchema

router = APIRouter()

@router.get("/transport", response_model=TransportOverviewResponse)
def get_transport_overview(db: Session = Depends(get_db)):
    """
    Returns complete transportation operations intelligence, route table, and hourly trends.
    """
    t_metric = db.query(TransportMetric).order_by(TransportMetric.id.desc()).first()
    routes = db.query(BusRoute).all()

    # Realistic hourly operational trend for charts
    hourly_trends = [
        {"hour": "06:00", "demand": 80, "capacity": 300, "wait_time": 4.2, "utilization": 26.7},
        {"hour": "07:00", "demand": 190, "capacity": 400, "wait_time": 6.8, "utilization": 47.5},
        {"hour": "08:00", "demand": 380, "capacity": 500, "wait_time": 14.1, "utilization": 76.0},
        {"hour": "08:30", "demand": 455, "capacity": 500, "wait_time": 18.4, "utilization": 91.0}, # CURRENT SPIKE
        {"hour": "09:00", "demand": 440, "capacity": 500, "wait_time": 17.2, "utilization": 88.0},
        {"hour": "10:00", "demand": 260, "capacity": 450, "wait_time": 8.5, "utilization": 57.8},
        {"hour": "11:00", "demand": 210, "capacity": 400, "wait_time": 7.0, "utilization": 52.5},
        {"hour": "12:00", "demand": 320, "capacity": 450, "wait_time": 11.4, "utilization": 71.1},
        {"hour": "13:00", "demand": 340, "capacity": 450, "wait_time": 12.0, "utilization": 75.6},
        {"hour": "14:00", "demand": 220, "capacity": 400, "wait_time": 7.2, "utilization": 55.0},
        {"hour": "15:00", "demand": 240, "capacity": 400, "wait_time": 7.5, "utilization": 60.0},
        {"hour": "16:00", "demand": 290, "capacity": 450, "wait_time": 9.8, "utilization": 64.4},
        {"hour": "17:00", "demand": 410, "capacity": 500, "wait_time": 16.0, "utilization": 82.0},
        {"hour": "18:00", "demand": 430, "capacity": 500, "wait_time": 17.5, "utilization": 86.0},
    ]

    return TransportOverviewResponse(
        active_buses=t_metric.active_buses if t_metric else 10,
        total_capacity=t_metric.total_capacity if t_metric else 500,
        current_demand=t_metric.current_demand if t_metric else 455,
        utilization_pct=t_metric.utilization_pct if t_metric else 91.0,
        avg_wait_min=t_metric.avg_wait_min if t_metric else 18.4,
        peak_wait_min=t_metric.peak_wait_min if t_metric else 26.5,
        overcrowding_pct=t_metric.overcrowding_pct if t_metric else 78.0,
        daily_cost=t_metric.daily_cost if t_metric else 18400.0,
        delayed_passengers=t_metric.delayed_passengers if t_metric else 142,
        routes=[BusRouteSchema.from_orm(r) for r in routes],
        hourly_trends=hourly_trends
    )

@router.get("/transport/routes", response_model=List[BusRouteSchema])
def get_routes(db: Session = Depends(get_db)):
    """Returns individual bus route telemetry."""
    routes = db.query(BusRoute).all()
    return [BusRouteSchema.from_orm(r) for r in routes]
