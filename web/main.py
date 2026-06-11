import asyncio
import logging
import webview
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app import app
from config import *
import os
import multiprocessing
static_dir = os.path.join(os.path.dirname(__file__), config.STATIC_DIR)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

if __name__ == "__main__":

    def custom_logic(window):
        logging.basicConfig(level=logging.INFO)
        uvicorn.run("app:app", host=config.HOST, port=config.PORT, reload=config.DEBUG)


    window = webview.create_window("WebApp", url=f"{config.HOST}:{config.PORT}")
    webview.start(custom_logic, window)

