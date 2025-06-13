from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from typing import List, Dict, Any, Optional
import random
from datetime import datetime
import os

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

# 개발 환경 확인
DEVELOPMENT = os.getenv("ENVIRONMENT", "development") == "development"


@router.get("/public-goods/example")
async def public_goods_example():
    return JSONResponse({"message": "Public Goods Game endpoint (예시)"})


@router.get("/trust-game/example")
async def trust_game_example():
    return JSONResponse({"message": "Trust Game endpoint (예시)"})


# 옵셔널 인증 의존성 (개발 환경에서는 우회 가능)
async def get_current_user_optional(request: Request) -> Optional[dict]:
    auth_header = request.headers.get("Authorization")

    if DEVELOPMENT and not auth_header:
        # 개발 환경에서 토큰이 없으면 더미 사용자 반환
        return {
            "uid": "12345678",
            "email": "12345678@eco.play",
            "auth_time": 1234567890,
            "iss": "https://securetoken.google.com/ecoplay-6fd53",
            "aud": "ecoplay-6fd53",
        }

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    id_token = auth_header.split(" ", 1)[1]
    try:
        decoded_token = verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")


# 인증 의존성 (항상 인증 필요)
async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    id_token = auth_header.split(" ", 1)[1]
    try:
        decoded_token = verify_id_token(id_token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")


@router.post("/public-goods/submit", response_model=GameResult)
async def submit_public_goods_round(
    request: PublicGoodsGameRequest, current_user=Depends(get_current_user_optional)
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

        # Firestore에 저장
        db = get_firestore_client()
        game_data = {
            "user_id": current_user["uid"],
            "user_email": current_user.get("email", f"{current_user['uid']}@eco.play"),
            "game_name": "public goods game",
            "round": request.round,
            "human_contribution": request.donation,
            "human_payoff": payoff,
            "computer_contributions": other_donations,
            "total_donated": total_donated,
            "common_pot": common_pot,
            "share_received": share_per_player,
            "new_balance": new_balance,
            "game_began_at": datetime.utcnow(),
            "timestamp": datetime.utcnow(),
            "response_time": 0,  # 프론트엔드에서 제공하도록 스키마 수정 필요
        }
        db.collection("public_goods_game").add(game_data)

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
    request: TrustGameRequest, current_user=Depends(get_current_user_optional)
):
    """Trust Game 라운드 제출 및 결과 계산"""
    try:
        if request.role == "receiver":
            # 수신자: 반환할 금액 결정
            points_kept = request.received_amount - request.return_amount
            new_balance = request.current_balance + points_kept

            game_data = {
                "user_id": current_user["uid"],
                "user_email": current_user.get(
                    "email", f"{current_user['uid']}@eco.play"
                ),
                "game_name": "trust game",
                "round": request.round,
                "role": "trustee",  # 표준 용어: 받아서 돌려주는 사람
                "decision": request.return_amount,
                "received_amount": request.received_amount,
                "multiplied_amount": request.received_amount,
                "points_kept": points_kept,
                "new_balance": new_balance,
                "game_began_at": datetime.utcnow(),
                "timestamp": datetime.utcnow(),
                "response_time": 0,
                "session_id": "",
                "partner_id": "",
            }

            message = f"받은 금액: {request.received_amount}, 반환: {request.return_amount}, 보유: {points_kept}"
            payoff = points_kept

        elif request.role == "trustee":
            # 신탁자: 투자할 금액 결정
            investment = request.investment
            new_balance = request.current_balance - investment

            game_data = {
                "user_id": current_user["uid"],
                "user_email": current_user.get(
                    "email", f"{current_user['uid']}@eco.play"
                ),
                "game_name": "trust game",
                "round": request.round,
                "role": "trustor",  # 표준 용어: 투자하는 사람
                "decision": investment,
                "received_amount": 0,  # 투자자는 이 라운드에서 받지 않음
                "multiplied_amount": investment * 3,
                "points_kept": -investment,  # 투자한 만큼 차감
                "new_balance": new_balance,
                "game_began_at": datetime.utcnow(),
                "timestamp": datetime.utcnow(),
                "response_time": 0,
                "session_id": "",
                "partner_id": "",
            }

            message = f"투자 금액: {investment}, 상대가 받은 금액: {investment * 3}"
            payoff = -investment  # 투자한 만큼 손실 (단순화)

        # Firestore에 저장
        db = get_firestore_client()
        db.collection("trust_game").add(game_data)

        return GameResult(
            success=True,
            payoff=payoff,
            new_balance=new_balance,
            message=message,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"게임 처리 중 오류: {str(e)}")


@router.get("/history/{game_type}")
async def get_game_history(
    game_type: str, current_user=Depends(get_current_user_optional)
):
    """사용자의 게임 기록 조회"""
    try:
        # 이메일에서 Medical Record Number 추출
        email = current_user.get("email", "")
        if "@eco.play" in email:
            medical_record_number = email.replace("@eco.play", "")
        else:
            medical_record_number = current_user["uid"]  # fallback to UID

        print(f"게임 기록 조회 - Medical Record Number: {medical_record_number}")

        db = get_firestore_client()

        # 게임 타입에 따른 컬렉션 선택
        if game_type == "public_goods":
            collection_name = "public_goods_game"
        elif game_type in ["trust_game_receiver", "trust_game_trustee"]:
            collection_name = "trust_game"
            role = "receiver" if game_type == "trust_game_receiver" else "trustee"
        else:
            raise HTTPException(status_code=400, detail="지원하지 않는 게임 타입입니다")

        query = db.collection(collection_name).where(
            "user_id",
            "==",
            medical_record_number,  # UID 대신 Medical Record Number 사용
        )

        if game_type in ["trust_game_receiver", "trust_game_trustee"]:
            query = query.where("role", "==", role)

        docs = query.stream()

        history = []
        for doc in docs:
            data = doc.to_dict()

            if game_type == "public_goods":
                history.append(
                    {
                        "round": data.get("round"),
                        "donation": data.get("human_contribution"),
                        "current_balance": data.get("new_balance"),
                        "partner_contribution": sum(
                            data.get("computer_contributions", [])
                        ),
                        "timestamp": data.get("timestamp"),
                    }
                )
            else:  # trust game
                if role == "receiver":
                    history.append(
                        {
                            "round": data.get("round"),
                            "received": data.get("received_amount"),
                            "returned": data.get("decision"),
                            "current_balance": data.get("new_balance"),
                            "timestamp": data.get("timestamp"),
                        }
                    )
                else:  # trustee
                    history.append(
                        {
                            "round": data.get("round"),
                            "invested": data.get("decision"),
                            "received_back": data.get("returned_amount"),
                            "current_balance": data.get("new_balance"),
                            "timestamp": data.get("timestamp"),
                        }
                    )

        # 라운드별로 정렬
        history.sort(key=lambda x: x.get("round", 0))

        print(f"조회된 기록 수: {len(history)}")

        return {"history": history}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"기록 조회 중 오류: {str(e)}")


@router.get("/debug/user/{user_id}")
async def debug_user_data(user_id: str):
    """특정 사용자의 Firebase 데이터를 직접 조회 (디버깅용)"""
    try:
        db = get_firestore_client()

        # Public Goods Game 데이터 조회
        pg_docs = (
            db.collection("public_goods_game").where("user_id", "==", user_id).stream()
        )
        pg_data = [doc.to_dict() for doc in pg_docs]

        # Trust Game 데이터 조회
        tg_docs = db.collection("trust_game").where("user_id", "==", user_id).stream()
        tg_data = [doc.to_dict() for doc in tg_docs]

        # 동의서 데이터 조회
        consent_docs = (
            db.collection("basic_info").where("user_id", "==", user_id).stream()
        )
        consent_data = [doc.to_dict() for doc in consent_docs]

        return {
            "user_id": user_id,
            "public_goods_game": {"count": len(pg_data), "data": pg_data},
            "trust_game": {"count": len(tg_data), "data": tg_data},
            "consent": {"count": len(consent_data), "data": consent_data},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"디버그 조회 중 오류: {str(e)}")


@router.get("/debug/all-users")
async def debug_all_users():
    """모든 사용자 ID를 조회 (디버깅용)"""
    try:
        db = get_firestore_client()

        # 모든 컬렉션에서 user_id 수집
        all_user_ids = set()

        # Public Goods Game에서 user_id 수집
        pg_docs = db.collection("public_goods_game").stream()
        for doc in pg_docs:
            data = doc.to_dict()
            if data.get("user_id"):
                all_user_ids.add(data["user_id"])

        # Trust Game에서 user_id 수집
        tg_docs = db.collection("trust_game").stream()
        for doc in tg_docs:
            data = doc.to_dict()
            if data.get("user_id"):
                all_user_ids.add(data["user_id"])

        # Consent에서 user_id 수집
        consent_docs = db.collection("basic_info").stream()
        for doc in consent_docs:
            data = doc.to_dict()
            if data.get("user_id"):
                all_user_ids.add(data["user_id"])

        return {
            "all_user_ids": sorted(list(all_user_ids)),
            "total_unique_users": len(all_user_ids),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"모든 사용자 조회 중 오류: {str(e)}"
        )
