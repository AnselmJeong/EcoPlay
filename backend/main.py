from fastapi import FastAPI, Request, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from routers import game, user, match, message, report, consent
from core.firebase import init_firebase, verify_id_token


# Lifespan context manager (startup/shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Firebase 초기화
    init_firebase()
    yield
    # TODO: 리소스 정리


app = FastAPI(lifespan=lifespan, title="EcoPlay API", version="0.1.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:9002"],  # 프론트엔드 URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["system"])
async def health_check():
    return JSONResponse({"status": "ok"})


# 인증 의존성 예시
async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid token"
        )
    id_token = auth_header.split(" ", 1)[1]
    try:
        decoded_token = verify_id_token(id_token)
        return decoded_token
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Firebase token"
        )


# 예시: 인증이 필요한 엔드포인트
@app.get("/me", tags=["user"])
async def get_me(user=Depends(get_current_user)):
    return {"user": user}


app.include_router(game.router)
app.include_router(user.router)
app.include_router(match.router)
app.include_router(message.router)
app.include_router(report.router)
app.include_router(consent.router)
