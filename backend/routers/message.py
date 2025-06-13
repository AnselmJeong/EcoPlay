from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
import random
from datetime import datetime

from schemas.message import LLMMessage, MessageRequest, MessageResponse
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


router = APIRouter(prefix="/message", tags=["message"])

# 게임별 LLM 메시지 템플릿
GAME_MESSAGES = {
    "public_goods": [
        "다른 플레이어들과의 협력이 모두에게 도움이 될 수 있습니다.",
        "개인의 이익과 집단의 이익 사이의 균형을 고려해보세요.",
        "기부는 전체 그룹의 이익을 증가시킵니다.",
        "다른 사람들의 기부 패턴을 관찰해보세요.",
    ],
    "trust_game_receiver": [
        "신뢰는 상호적입니다. 적절한 반환이 중요합니다.",
        "상대방의 투자에 감사하며 공정하게 반환해보세요.",
        "장기적인 관계를 고려한 결정을 내려보세요.",
        "신뢰를 쌓는 것은 시간이 걸리지만 깨뜨리는 것은 순간입니다.",
    ],
    "trust_game_trustee": [
        "상대방의 성격을 파악하여 투자 전략을 세워보세요.",
        "적절한 투자로 상호 이익을 추구해보세요.",
        "과도한 투자는 위험할 수 있습니다.",
        "상대방의 반응을 통해 신뢰도를 측정해보세요.",
    ],
}


@router.get("/example")
async def message_example():
    return JSONResponse({"message": "Message endpoint (예시)"})


@router.post("/generate", response_model=MessageResponse)
async def generate_game_message(
    request: MessageRequest, user=Depends(get_current_user)
):
    """게임 상황에 맞는 LLM 메시지 생성"""
    try:
        # 게임 타입에 따른 메시지 선택
        if request.game_type not in GAME_MESSAGES:
            raise HTTPException(status_code=400, detail="지원하지 않는 게임 타입입니다")

        # 라운드와 상황에 따른 메시지 선택 로직
        messages = GAME_MESSAGES[request.game_type]

        # 간단한 규칙 기반 메시지 선택 (실제로는 더 복잡한 LLM 로직 사용 가능)
        if request.round <= 3:
            # 초반 라운드: 기본 전략 안내
            selected_message = messages[0]
        elif request.round <= 7:
            # 중반 라운드: 상황 분석 안내
            selected_message = messages[1] if len(messages) > 1 else messages[0]
        else:
            # 후반 라운드: 고급 전략 안내
            selected_message = random.choice(messages)

        # 개인화된 메시지 추가
        if request.performance_data:
            if request.performance_data.get("balance", 0) > 100:
                selected_message += " 현재 좋은 성과를 보이고 있습니다!"
            elif request.performance_data.get("balance", 0) < 50:
                selected_message += " 전략을 재검토해보는 것이 좋겠습니다."

        # 메시지를 Firestore에 저장
        db = get_firestore_client()
        message_data = {
            "user_id": user["uid"],
            "game_type": request.game_type,
            "round": request.round,
            "content": selected_message,
            "role": "assistant",
            "timestamp": datetime.utcnow().isoformat(),
        }

        db.collection("llm_messages").add(message_data)

        return MessageResponse(
            content=selected_message,
            role="assistant",
            timestamp=datetime.utcnow().isoformat(),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"메시지 생성 중 오류: {str(e)}")


@router.get("/history")
async def get_message_history(game_type: str = None, user=Depends(get_current_user)):
    """사용자의 메시지 기록 조회"""
    try:
        db = get_firestore_client()
        query = db.collection("llm_messages").where("user_id", "==", user["uid"])

        if game_type:
            query = query.where("game_type", "==", game_type)

        docs = query.order_by("timestamp").stream()

        messages = []
        for doc in docs:
            data = doc.to_dict()
            messages.append(data)

        return {"messages": messages}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"메시지 기록 조회 중 오류: {str(e)}"
        )


@router.post("/feedback")
async def save_user_feedback(
    message_id: str, helpful: bool, user=Depends(get_current_user)
):
    """사용자 피드백 저장"""
    try:
        db = get_firestore_client()
        feedback_data = {
            "user_id": user["uid"],
            "message_id": message_id,
            "helpful": helpful,
            "timestamp": datetime.utcnow().isoformat(),
        }

        db.collection("message_feedback").add(feedback_data)

        return {"success": True, "message": "피드백이 저장되었습니다"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"피드백 저장 중 오류: {str(e)}")
