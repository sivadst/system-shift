from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from ..database import get_db
from ..models import IncidentEvent
from ..schemas import EventListResponse, CampusEventSchema

router = APIRouter()

@router.get("/events", response_model=EventListResponse)
def get_campus_events(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=5, le=100),
    system: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    """
    Returns filtered and paginated operational campus events.
    """
    query = db.query(IncidentEvent)

    if system and system.upper() != "ALL":
        query = query.filter(IncidentEvent.system_affected == system.upper())

    if severity and severity.upper() != "ALL":
        query = query.filter(IncidentEvent.severity == severity.upper())

    if location and location.upper() != "ALL":
        query = query.filter(IncidentEvent.location.ilike(f"%{location}%"))

    if search:
        search_filter = or_(
            IncidentEvent.title.ilike(f"%{search}%"),
            IncidentEvent.description.ilike(f"%{search}%"),
            IncidentEvent.location.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)

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
