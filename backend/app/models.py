from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from .database import Base

class CampusLocation(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # Transport, Dining, Academic, Study, Infrastructure
    capacity = Column(Integer, default=500)
    current_occupancy = Column(Integer, default=0)
    utilization_pct = Column(Float, default=0.0)
    status = Column(String(20), default="NORMAL")  # NORMAL, ELEVATED, CRITICAL

class BusRoute(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    route_code = Column(String(20), unique=True, index=True)  # Route 1, Route 2, Route 3, Route 4
    name = Column(String(100), nullable=False)
    source = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    stops_count = Column(Integer, default=8)
    active_buses = Column(Integer, default=2)
    capacity = Column(Integer, default=125)
    current_passengers = Column(Integer, default=121)
    utilization_pct = Column(Float, default=96.8)
    avg_wait_min = Column(Float, default=18.4)
    status = Column(String(20), default="CRITICAL")  # HEALTHY, WARNING, CRITICAL
    delay_min = Column(Float, default=8.2)

    buses = relationship("Bus", back_populates="route")

class Bus(Base):
    __tablename__ = "buses"

    id = Column(Integer, primary_key=True, index=True)
    bus_number = Column(String(30), unique=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)
    capacity = Column(Integer, default=50)
    current_load = Column(Integer, default=48)
    status = Column(String(30), default="IN_SERVICE")  # IN_SERVICE, MAINTENANCE, STANDBY
    driver_name = Column(String(100))
    current_stop = Column(String(100))
    fuel_level_pct = Column(Float, default=85.0)

    route = relationship("BusRoute", back_populates="buses")

class SystemMetric(Base):
    __tablename__ = "system_metrics"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    system_name = Column(String(50), nullable=False, index=True)  # TRANSPORT, CANTEEN, LIBRARY, NETWORK, CLASSROOMS, FACILITIES, STUDENTS
    load_pct = Column(Float, nullable=False)
    status = Column(String(20), default="NORMAL")  # NORMAL, ELEVATED, CRITICAL
    pressure_active = Column(Boolean, default=False)
    bottleneck_score = Column(Float, default=0.0)
    metric_label = Column(String(100))
    metric_value = Column(String(50))
    notes = Column(Text, nullable=True)

class TransportMetric(Base):
    __tablename__ = "transport_metrics"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    active_buses = Column(Integer, default=10)
    total_capacity = Column(Integer, default=500)
    current_demand = Column(Integer, default=455)
    utilization_pct = Column(Float, default=91.0)
    avg_wait_min = Column(Float, default=18.4)
    peak_wait_min = Column(Float, default=26.5)
    overcrowding_pct = Column(Float, default=78.0)
    daily_cost = Column(Float, default=18400.0)
    delayed_passengers = Column(Integer, default=142)

class CanteenMetric(Base):
    __tablename__ = "canteen_metrics"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    canteen_name = Column(String(100), default="Central Dining Hall")
    occupancy_pct = Column(Float, default=74.0)
    queue_wait_min = Column(Float, default=14.2)
    meals_served_hourly = Column(Integer, default=320)
    pressure_active = Column(Boolean, default=True)

class LibraryMetric(Base):
    __tablename__ = "library_metrics"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    library_name = Column(String(100), default="Main Science & Tech Library")
    occupancy_pct = Column(Float, default=96.0)
    available_seats = Column(Integer, default=16)
    noise_level_db = Column(Float, default=44.5)
    pressure_active = Column(Boolean, default=True)

class ClassroomMetric(Base):
    __tablename__ = "classroom_metrics"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    active_classes = Column(Integer, default=84)
    utilization_pct = Column(Float, default=62.0)
    total_rooms = Column(Integer, default=120)

class IncidentEvent(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    system_affected = Column(String(50), nullable=False, index=True)
    severity = Column(String(20), default="MEDIUM", index=True)  # LOW, MEDIUM, HIGH, CRITICAL
    location = Column(String(100), default="Campus Center")
    resolved = Column(Boolean, default=False)
    impact_summary = Column(Text, nullable=True)

    __table_args__ = (
        Index("idx_incident_ts_sys", "timestamp", "system_affected"),
    )

class SimulationScenario(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    scenario_name = Column(String(150), nullable=False)
    active_buses = Column(Integer, default=10)
    bus_frequency_min = Column(Float, default=10.0)
    student_demand_mod_pct = Column(Float, default=0.0)
    peak_window_min = Column(Integer, default=90)
    
    # Simulation outputs
    baseline_wait_min = Column(Float, default=18.4)
    simulated_wait_min = Column(Float)
    baseline_overcrowding_pct = Column(Float, default=78.0)
    simulated_overcrowding_pct = Column(Float)
    baseline_utilization_pct = Column(Float, default=91.0)
    simulated_utilization_pct = Column(Float)
    baseline_daily_cost = Column(Float, default=18400.0)
    simulated_daily_cost = Column(Float)
    throughput_per_hr = Column(Integer)
    unmet_demand_count = Column(Integer)
    
    trade_off_type = Column(String(50))  # TRADE_OFF_DETECTED, CAPACITY_IMPROVED, SYSTEM_DEGRADED
    trade_off_summary = Column(Text)
    details_json = Column(Text, nullable=True)

class AIQueryLog(Base):
    __tablename__ = "ai_queries"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_query = Column(Text, nullable=False)
    system_context_json = Column(Text, nullable=False)
    response_text = Column(Text, nullable=False)
    model_used = Column(String(50), default="gemini-grounded")
    confidence_score = Column(Float, default=0.95)
    grounded_citations_json = Column(Text, nullable=True)
