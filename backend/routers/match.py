from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Dict, List
import random
from datetime import datetime

from schemas.match import MatchRequest, MatchResult
from core.firebase import get_firestore_client, verify_id_token


# 인증 의존성 (순환 import 방지)
async def get_current_user(request):
    from fastapi import HTTPException, status

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


router = APIRouter(prefix="/match", tags=["match"])

# Trust Game 상대방 성격 유형
OPPONENT_PERSONALITIES = [
    {
        "name": "Cautious Receiver",
        "description": "신중한 수신자 - 적게 반환 (10-30%)",
        "return_rate_range": (0.1, 0.3),
    },
    {
        "name": "Fair Receiver",
        "description": "공정한 수신자 - 적당히 반환 (40-60%)",
        "return_rate_range": (0.4, 0.6),
    },
    {
        "name": "Generous Receiver",
        "description": "관대한 수신자 - 많이 반환 (70-90%)",
        "return_rate_range": (0.7, 0.9),
    },
    {
        "name": "Unpredictable Receiver",
        "description": "예측 불가능한 수신자 - 랜덤 반환 (10-90%)",
        "return_rate_range": (0.1, 0.9),
    },
]


@router.get("/example")
async def match_example():
    return JSONResponse({"message": "Match endpoint (예시)"})


@router.post("/trust-game", response_model=MatchResult)
async def match_trust_game_opponent(
    request: MatchRequest, user=Depends(get_current_user)
):
    """Trust Game에서 상대방 성격 매칭"""
    try:
        if request.game_type != "trust-game":
            raise HTTPException(status_code=400, detail="지원하지 않는 게임 타입입니다")

        # 랜덤하게 상대방 성격 선택
        selected_personality = random.choice(OPPONENT_PERSONALITIES)

        # 매칭 결과를 Firestore에 저장
        db = get_firestore_client()
        match_data = {
            "user_id": user["uid"],
            "game_type": request.game_type,
            "matched_personality": selected_personality["name"],
            "personality_description": selected_personality["description"],
            "return_rate_range": selected_personality["return_rate_range"],
            "timestamp": datetime.utcnow().isoformat(),
        }

        match_ref = db.collection("game_matches").add(match_data)
        match_id = match_ref[1].id

        return MatchResult(
            user_id=user["uid"],
            matched_personality=selected_personality["name"],
            match_id=match_id,
            timestamp=datetime.utcnow().isoformat(),
            description=selected_personality["description"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"매칭 중 오류: {str(e)}")


@router.get("/trust-game/personalities")
async def get_available_personalities():
    """사용 가능한 상대방 성격 유형 목록 조회"""
    return {"personalities": OPPONENT_PERSONALITIES}


@router.get("/history")
async def get_match_history(user=Depends(get_current_user)):
    """사용자의 매칭 기록 조회"""
    try:
        db = get_firestore_client()
        query = db.collection("game_matches").where("user_id", "==", user["uid"])
        docs = query.stream()

        history = []
        for doc in docs:
            data = doc.to_dict()
            history.append(data)

        return {"match_history": history}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"매칭 기록 조회 중 오류: {str(e)}")
