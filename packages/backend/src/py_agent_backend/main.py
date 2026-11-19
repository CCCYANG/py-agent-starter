"""ASGI entry point for the backend learning service."""

from fastapi import FastAPI

app = FastAPI(title="Python Agent Starter", version="0.1.0")


@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    """Report process liveness without accessing external services."""
    return {"status": "ok"}
