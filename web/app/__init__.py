from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.templating import Jinja2Templates
from tests.config import *
from app import common
templates = Jinja2Templates(directory=common.resource_path(config.TEMPLATES_FOLDER))

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Started")
    yield
    print("Stopped")
app = FastAPI(lifespan=lifespan)

from app import routes
