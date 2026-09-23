from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg2://user:password@localhost:5432/standardsos"
    database_ssl: bool = False
    secret_key: str = "change-me-in-production"
    cookie_secure: bool = False
    gmail_user: str | None = None
    gmail_app_password: str | None = None
    contact_admin_email: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore", case_sensitive=False)


settings = Settings()
