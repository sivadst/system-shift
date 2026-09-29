import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "SYSTEM//SHIFT"
    TAGLINE: str = "The machine has the data. Humans need the context."
    VERSION: str = "1.0.0"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./campus_operations.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", os.getenv("GOOGLE_API_KEY", ""))
    CORS_ORIGINS: list[str] = ["*"]
    SYNTHETIC_RECORDS_TARGET: int = 100_000

settings = Settings()
