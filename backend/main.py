import logging
import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from core.auth import get_current_user
from core.firebase import init_firebase
from core.game_config import get_game_config
from routers import consent, game, match, message, questionnaire, report, user

logger = logging.getLogger(__name__)


def get_allowed_origins() -> list[str]:
    configured_origins = os.getenv("CORS_ORIGINS", "")
    if configured_origins.strip():
        return [
            origin.strip().rstrip("/")
            for origin in configured_origins.split(",")
            if origin.strip()
        ]

    environment = os.getenv("ENVIRONMENT", "production").strip().lower()
    if environment == "development":
        return ["http://localhost:3000", "http://localhost:9000"]

    logger.warning(
        "CORS_ORIGINS가 비어 있습니다. 배포된 frontend에서 API를 호출할 수 없습니다."
    )
    return []


# Lifespan context manager (startup/shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Firebase 초기화
    init_firebase()
    get_game_config()
    yield
    # TODO: 리소스 정리


app = FastAPI(lifespan=lifespan, title="EcoPlay API", version="0.2.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
async def health_check():
    return JSONResponse({"status": "ok"})


@app.get("/me", tags=["user"])
async def get_me(user=Depends(get_current_user)):
    return {"user": user}


app.include_router(game.router)
app.include_router(user.router)
app.include_router(message.router)
app.include_router(report.router)
app.include_router(consent.router)
app.include_router(questionnaire.router)
app.include_router(match.router)
