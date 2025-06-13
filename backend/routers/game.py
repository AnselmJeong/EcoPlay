from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List, Dict, Any
import random
from datetime import datetime

from schemas.game import (
    PublicGoodsGameRound,
    TrustGameRound,
    PublicGoodsGameRequest,
    TrustGameRequest,
    GameResult,
)
from core.firebase import get_firestore_client, verify_id_token
from routers.match import OPPONENT_PERSONALITIES

router = APIRouter(prefix="/game", tags=["game"])

# Public Goods Game 상수
TOTAL_ROUNDS = 10
INITIAL_POINTS = 100
NUM_PLAYERS = 5
MULTIPLIER = 1.5


@router.get("/public-goods/example")
async def public_goods_example():
    return JSONResponse({"message": "Public Goods Game endpoint (예시)"})


@router.get("/trust-game/example")
async def trust_game_example():
    return JSONResponse({"message": "Trust Game endpoint (예시)"})


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


@router.post("/public-goods/submit", response_model=GameResult)
async def submit_public_goods_round(
    request: PublicGoodsGameRequest,
    # user=Depends(get_current_user)  # 임시로 인증 비활성화
):
    """Public Goods Game 라운드 제출 및 결과 계산"""
    try:
        # 다른 플레이어들의 기부 시뮬레이션 (0-25% 범위)
        other_donations = [
            random.randint(0, int(INITIAL_POINTS * 0.25))
            for _ in range(NUM_PLAYERS - 1)
        ]

        total_donated = request.donation + sum(other_donations)
        common_pot = total_donated * MULTIPLIER
        share_per_player = common_pot / NUM_PLAYERS
        payoff = share_per_player - request.donation
        new_balance = request.current_balance + payoff

        # Firestore에 저장 (임시로 비활성화)
        # db = get_firestore_client()
        # game_data = {
        #     "user_id": "test_user",  # user["uid"],
        #     "game_type": "public_goods",
        #     "round": request.round,
        #     "donation": request.donation,
        #     "total_donated": total_donated,
        #     "common_pot": common_pot,
        #     "share_received": share_per_player,
        #     "payoff": payoff,
        #     "new_balance": new_balance,
        #     "timestamp": datetime.utcnow().isoformat(),
        # }
        # db.collection("game_results").add(game_data)

        return GameResult(
            success=True,
            payoff=payoff,
            new_balance=new_balance,
            message=f"기부: {request.donation}, 총 기부: {total_donated}, 공통 자금: {common_pot:.1f}, 받은 몫: {share_per_player:.1f}",
            user_donation=request.donation,
            other_donations=other_donations,
            total_donated=total_donated,
            common_pot=common_pot,
            share_per_player=share_per_player,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"게임 처리 중 오류: {str(e)}")


@router.post("/trust-game/submit", response_model=GameResult)
async def submit_trust_game_round(
    request: TrustGameRequest,
    # user=Depends(get_current_user)  # 임시로 인증 비활성화
):
    """Trust Game 라운드 제출 및 결과 계산"""
    try:
        if request.role == "receiver":
            # 수신자: 반환할 금액 결정
            points_kept = request.received_amount - request.return_amount
            new_balance = request.current_balance + points_kept

            # game_data = {
            #     "user_id": "test_user",  # user["uid"] 대신 임시 값
            #     "game_type": "trust_game_receiver",
            #     "round": request.round,
            #     "received_amount": request.received_amount,
            #     "return_amount": request.return_amount,
            #     "points_kept": points_kept,
            #     "new_balance": new_balance,
            #     "timestamp": datetime.utcnow().isoformat(),
            # }

            message = f"받은 금액: {request.received_amount}, 반환: {request.return_amount}, 보유: {points_kept}"
            payoff = points_kept

        else:  # trustee
            # 신탁자: 투자 후 상대방의 반환 시뮬레이션
            tripled_amount = request.investment * 3

            # OPPONENT_PERSONALITIES에서 랜덤하게 선택
            selected_personality = random.choice(OPPONENT_PERSONALITIES)
            return_rate_min, return_rate_max = selected_personality["return_rate_range"]
            return_rate = random.uniform(return_rate_min, return_rate_max)
            returned_amount = int(tripled_amount * return_rate)

            payoff = returned_amount - request.investment
            new_balance = request.current_balance + payoff

            # game_data = {
            #     "user_id": "test_user",  # user["uid"] 대신 임시 값
            #     "game_type": "trust_game_trustee",
            #     "round": request.round,
            #     "investment": request.investment,
            #     "tripled_amount": tripled_amount,
            #     "opponent_personality": selected_personality["name"],
            #     "return_rate": return_rate,
            #     "returned_amount": returned_amount,
            #     "payoff": payoff,
            #     "new_balance": new_balance,
            #     "timestamp": datetime.utcnow().isoformat(),
            # }

            message = f"투자: {request.investment}, 3배: {tripled_amount}, 상대방({selected_personality['name']}): {returned_amount} 반환"

        # Firestore에 저장 (임시로 비활성화)
        # db = get_firestore_client()
        # db.collection("game_results").add(game_data)

        return GameResult(
            success=True,
            payoff=payoff,
            new_balance=new_balance,
            message=message,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"게임 처리 중 오류: {str(e)}")


@router.get("/history/{game_type}")
async def get_game_history(game_type: str, user=Depends(get_current_user)):
    """사용자의 게임 기록 조회"""
    try:
        db = get_firestore_client()
        query = (
            db.collection("game_results")
            .where("user_id", "==", user["uid"])
            .where("game_type", "==", game_type)
        )
        docs = query.stream()

        history = []
        for doc in docs:
            data = doc.to_dict()
            history.append(data)

        return {"history": history}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"기록 조회 중 오류: {str(e)}")
