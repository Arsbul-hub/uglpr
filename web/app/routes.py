from fastapi import Request
from starlette.responses import HTMLResponse

from app import app, templates

@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(name="index.html", request=request)
