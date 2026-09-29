from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import SessionLocal, engine, Base
from .data_generator import seed_initial_state, generate_100k_synthetic_events
from .api import dashboard, system_map, transport, simulation, ai, events, data

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist, seed campus state and 100k records
    print("[SYSTEM//SHIFT] Initializing database and synthetic telemetry generator...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_initial_state(db)
        total_events = generate_100k_synthetic_events(db, target_count=settings.SYNTHETIC_RECORDS_TARGET)
        print(f"[SYSTEM//SHIFT] Database initialized with {total_events} operational records. Systems online!")
    finally:
        db.close()
    yield
    print("[SYSTEM//SHIFT] Shutting down operations engine.")

app = FastAPI(
    title="SYSTEM//SHIFT",
    description="Human–Machine Operations Interface API for Simulated University Campus",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(system_map.router, prefix="/api", tags=["System Map"])
app.include_router(transport.router, prefix="/api", tags=["Transport"])
app.include_router(simulation.router, prefix="/api", tags=["Simulation"])
app.include_router(ai.router, prefix="/api", tags=["AI Reasoning"])
app.include_router(events.router, prefix="/api", tags=["Events Feed"])
app.include_router(data.router, prefix="/api", tags=["Data Explorer"])

@app.get("/")
def get_root():
    return {
        "system": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "status": "OPERATIONAL",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SYSTEM//SHIFT Core Backend",
        "version": settings.VERSION
    }
