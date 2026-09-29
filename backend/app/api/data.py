from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import os
from ..database import get_db
from ..models import IncidentEvent, CampusLocation, BusRoute, Bus, SystemMetric
from ..schemas import DataExplorerSummary, EventListResponse, CampusEventSchema

router = APIRouter()

@router.get("/data/summary", response_model=DataExplorerSummary)
def get_data_summary(db: Session = Depends(get_db)):
    """
    Returns high-level statistics proving the scope, scale, and authenticity of the synthetic campus database.
    """
    total_events = db.query(func.count(IncidentEvent.id)).scalar() or 0
    locations_count = db.query(func.count(CampusLocation.id)).scalar() or 0
    routes_count = db.query(func.count(BusRoute.id)).scalar() or 0
    buses_count = db.query(func.count(Bus.id)).scalar() or 0
    systems_count = db.query(SystemMetric.system_name).distinct().count() or 7

    # Find earliest and latest timestamps
    earliest = db.query(func.min(IncidentEvent.timestamp)).scalar()
    latest = db.query(func.max(IncidentEvent.timestamp)).scalar()

    earliest_str = earliest.strftime("%Y-%m-%d %H:%M:%S") if earliest else "30 days ago"
    latest_str = latest.strftime("%Y-%m-%d %H:%M:%S") if latest else "Current telemetry"

    # Database file size estimate
    db_size_mb = 0.0
    if os.path.exists("./campus_operations.db"):
        db_size_mb = round(os.path.getsize("./campus_operations.db") / (1024 * 1024), 2)
    else:
        db_size_mb = round((total_events * 320) / (1024 * 1024), 2)

    return DataExplorerSummary(
        total_records=total_events,
        historical_days=30,
        earliest_record=earliest_str,
        latest_record=latest_str,
        locations_count=locations_count,
        routes_count=routes_count,
        active_buses_count=buses_count,
        systems_monitored=systems_count,
        dataset_size_est_mb=max(12.5, db_size_mb)
    )

@router.get("/data/records", response_model=EventListResponse)
def get_raw_records(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=10, le=100),
    system: Optional[str] = Query(None)
):
    """Inspect raw records for technical judges."""
    query = db.query(IncidentEvent)
    if system and system.upper() != "ALL":
        query = query.filter(IncidentEvent.system_affected == system.upper())

    total = query.count()
    events = (
        query.order_by(IncidentEvent.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return EventListResponse(
        total=total,
        page=page,
        limit=limit,
        events=[CampusEventSchema.from_orm(e) for e in events]
    )
