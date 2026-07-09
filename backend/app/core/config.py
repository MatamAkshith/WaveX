from typing import Optional
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings container holding all environment variables
    using pydantic-settings.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    DATABASE_URL: str = Field(
        default="sqlite:///./wavex.db",
        description="Database connection URL (SQLite for hackathon; swap to Postgres via env var)",
    )
    OPENAI_API_KEY: Optional[str] = Field(default=None, description="OpenAI API key")
    GEMINI_API_KEY: Optional[str] = Field(default=None, description="Gemini API key")
    GROQ_API_KEY: Optional[str] = Field(default=None, description="Groq API key (LLM inference)")
    GROQ_MODEL: str = Field(default="llama-3.3-70b-versatile", description="Groq model for agents")
    API_KEY: Optional[str] = Field(
        default=None,
        description="If set, all data endpoints require the X-API-Key header (database firewall)",
    )
    ALLOWED_ORIGINS: str = Field(
        default="http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173",
        description="Comma-separated CORS origins allowed to call the API",
    )
    CHROMA_DB_PATH: Optional[str] = Field(default=None, description="ChromaDB path")
    ENVIRONMENT: str = Field(default="development", description="Application environment")
    DEBUG: bool = Field(default=False, description="Debug mode flag")

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_postgres_url(cls, v: str) -> str:
        """
        Ensures postgresql:// dialect is used instead of postgres://,
        especially when deploying on platforms like Heroku.
        """
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

settings = Settings()
print(f"DEBUG: GROQ key loaded, length={len(settings.GROQ_API_KEY) if settings.GROQ_API_KEY else 0}, prefix={settings.GROQ_API_KEY[:8] if settings.GROQ_API_KEY else 'NONE'}")
settings = Settings()
