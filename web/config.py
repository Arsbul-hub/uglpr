
from pydantic_settings import BaseSettings, DotEnvSettingsSource
from pydantic import BaseModel, computed_field, Field

from app.common import resource_path


class Config(BaseSettings):
    HOST: str
    PORT: int
    DEBUG: bool
    TEMPLATES_FOLDER: str
    STATIC_DIR: str

    @classmethod
    def settings_customise_sources(cls, settings_cls, **kwargs):
        return (DotEnvSettingsSource(settings_cls, resource_path("./.env")),)

config = Config()

