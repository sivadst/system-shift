from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class BusRouteSchema(BaseModel):
    id: int
    route_code: str
    name: str
    source: str
    destination: str
    stops_count: int
    active_buses: int
    capacity: int
    current_passengers: int
    utilization_pct: float
    avg_wait_min: float
    status: str
    delay_min: float

    class Config:
        from_attributes = True

class SystemMetricSchema(BaseModel):
    id: int
    system_name: str
    load_pct: float
    status: str
    pressure_active: bool
    bottleneck_score: float
    metric_label: Optional[str] = None
    metric_value: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class DashboardPressureSchema(BaseModel):
    system: str
    load_pct: float
    status: str
    pressure_label: str
    detail: str
    cascade_target: str
    severity: str

class DashboardResponse(BaseModel):
    system_status: str
    live_simulation_time: str
    pressures_count: int
    pressures: List[DashboardPressureSchema]
    system_cards: List[SystemMetricSchema]
    active_bottleneck: str
    summary: str

class SystemNodeSchema(BaseModel):
    id: str
    label: str
    category: str
    load_pct: float
    status: str
    pressure_active: bool
    position: Dict[str, float]
    metrics: Dict[str, Any]

class SystemEdgeSchema(BaseModel):
    id: str
    source: str
    target: str
    label: str
    animated: bool
    strength: float
    is_bottleneck_path: bool

class SystemMapResponse(BaseModel):
    nodes: List[SystemNodeSchema]
    edges: List[SystemEdgeSchema]
    active_cascades: List[str]
    detected_pressures: int

class TransportOverviewResponse(BaseModel):
    active_buses: int
    total_capacity: int
    current_demand: int
    utilization_pct: float
    avg_wait_min: float
    peak_wait_min: float
    overcrowding_pct: float
    daily_cost: float
    delayed_passengers: int
    routes: List[BusRouteSchema]
    hourly_trends: List[Dict[str, Any]]

class SimulationRequest(BaseModel):
    scenario_name: Optional[str] = "Custom Campus Scenario"
    active_buses: int = Field(default=14, ge=4, le=30)
    bus_frequency_min: float = Field(default=8.0, ge=3.0, le=30.0)
    student_demand_mod_pct: float = Field(default=0.0, ge=-50.0, le=100.0)
    peak_window_min: int = Field(default=90, ge=30, le=240)

class MetricComparison(BaseModel):
    metric: str
    current_value: float
    simulated_value: float
    unit: str
    diff_abs: float
    diff_pct: float
    direction: str  # "UP", "DOWN", "NEUTRAL"
    impact: str     # "POSITIVE", "NEGATIVE", "NEUTRAL"

class RouteSimImpact(BaseModel):
    route_code: str
    current_utilization: float
    simulated_utilization: float
    current_wait: float
    simulated_wait: float
    status: str

class SimulationResponse(BaseModel):
    scenario_name: str
    inputs: Dict[str, Any]
    current_state: Dict[str, Any]
    simulated_state: Dict[str, Any]
    comparisons: List[MetricComparison]
    trade_off_type: str
    trade_off_title: str
    trade_off_description: str
    human_decision_prompt: str
    route_impacts: List[RouteSimImpact]
    cascading_impact: Dict[str, Any]

class AIQueryRequest(BaseModel):
    question: str
    current_route: Optional[str] = None
    scenario_id: Optional[int] = None

class AIQueryResponse(BaseModel):
    question: str
    explanation: str
    grounded_data: Dict[str, Any]
    affected_nodes: List[str]
    trade_offs_noted: Optional[str] = None
    confidence_score: float
    model_used: str
    suggested_followups: List[str]

class CampusEventSchema(BaseModel):
    id: int
    timestamp: datetime
    title: str
    description: str
    system_affected: str
    severity: str
    location: str
    resolved: bool
    impact_summary: Optional[str] = None

    class Config:
        from_attributes = True

class EventListResponse(BaseModel):
    total: int
    page: int
    limit: int
    events: List[CampusEventSchema]

class DataExplorerSummary(BaseModel):
    total_records: int
    historical_days: int
    earliest_record: str
    latest_record: str
    locations_count: int
    routes_count: int
    active_buses_count: int
    systems_monitored: int
    dataset_size_est_mb: float
