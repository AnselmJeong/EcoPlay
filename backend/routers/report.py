from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from typing import List, Dict, Any, Optional
from datetime import datetime
import os

from core.firebase import get_firestore_client, verify_id_token

router = APIRouter(prefix="/report", tags=["report"])

# 개발 환경 확인
DEVELOPMENT = os.getenv("ENVIRONMENT", "development") == "development"


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


# 인증 의존성
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


@router.get("/games")
async def get_game_report(
    game_type: Optional[str] = None, current_user=Depends(get_current_user_optional)
):
    """게임별 리포트 조회"""
    try:
        # 이메일에서 Medical Record Number 추출
        email = current_user.get("email", "")
        if "@eco.play" in email:
            medical_record_number = email.replace("@eco.play", "")
        else:
            medical_record_number = current_user["uid"]  # fallback to UID

        db = get_firestore_client()

        if game_type:
            if game_type == "public_goods":
                collection_name = "public_goods_game"
            elif game_type in [
                "trust_game",
                "trust_game_receiver",
                "trust_game_trustee",
            ]:
                collection_name = "trust_game"
            else:
                raise HTTPException(
                    status_code=400, detail="지원하지 않는 게임 타입입니다"
                )

            query = db.collection(collection_name).where(
                "user_id",
                "==",
                medical_record_number,  # UID 대신 Medical Record Number 사용
            )
            docs = query.stream()

            games = []
            for doc in docs:
                data = doc.to_dict()
                games.append(data)

            return {"game_type": game_type, "games": games}
        else:
            # 모든 게임 타입 조회
            all_games = {}

            # Public Goods Game
            pg_query = db.collection("public_goods_game").where(
                "user_id",
                "==",
                medical_record_number,  # UID 대신 Medical Record Number 사용
            )
            pg_docs = pg_query.stream()
            all_games["public_goods"] = [doc.to_dict() for doc in pg_docs]

            # Trust Game
            tg_query = db.collection("trust_game").where(
                "user_id",
                "==",
                medical_record_number,  # UID 대신 Medical Record Number 사용
            )
            tg_docs = tg_query.stream()
            all_games["trust_game"] = [doc.to_dict() for doc in tg_docs]

            return {"games": all_games}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"리포트 조회 중 오류: {str(e)}")


@router.get("/public-goods")
async def get_public_goods_report(current_user=Depends(get_current_user_optional)):
    """공공재 게임 상세 리포트"""
    try:
        # 이메일에서 Medical Record Number 추출
        email = current_user.get("email", "")
        if "@eco.play" in email:
            medical_record_number = email.replace("@eco.play", "")
        else:
            medical_record_number = current_user["uid"]  # fallback to UID

        db = get_firestore_client()
        query = db.collection("public_goods_game").where(
            "user_id",
            "==",
            medical_record_number,  # UID 대신 Medical Record Number 사용
        )
        docs = query.stream()

        rounds = []
        total_contribution = 0
        total_payoff = 0

        for doc in docs:
            data = doc.to_dict()
            round_data = {
                "round": data.get("round"),
                "donation": data.get(
                    "human_contribution"
                ),  # 프론트엔드가 기대하는 필드명
                "current_balance": data.get(
                    "human_payoff"
                ),  # 프론트엔드가 기대하는 필드명
                "human_contribution": data.get("human_contribution"),
                "computer_contributions": data.get("computer_contributions", []),
                "human_payoff": data.get("human_payoff"),
                "total_donated": data.get("total_donated"),
                "common_pot": data.get("common_pot"),
                "share_received": data.get("share_received"),
                "partner_contribution": sum(
                    data.get("computer_contributions", [])
                ),  # 다른 플레이어들의 기부액 합계
                "timestamp": data.get("timestamp"),
            }
            rounds.append(round_data)
            total_contribution += data.get("human_contribution", 0)
            total_payoff += data.get("human_payoff", 0)

        # 라운드별 정렬
        rounds.sort(key=lambda x: x.get("round", 0))

        summary = {
            "total_rounds": len(rounds),
            "total_contribution": total_contribution,
            "total_payoff": total_payoff,
            "average_contribution": total_contribution / len(rounds) if rounds else 0,
            "average_payoff": total_payoff / len(rounds) if rounds else 0,
        }

        return {"summary": summary, "rounds": rounds}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"공공재 게임 리포트 조회 중 오류: {str(e)}"
        )


@router.get("/trust-game")
async def get_trust_game_report(
    role: Optional[str] = None, current_user=Depends(get_current_user_optional)
):
    """신뢰 게임 상세 리포트"""
    try:
        # 이메일에서 Medical Record Number 추출
        email = current_user.get("email", "")
        if "@eco.play" in email:
            medical_record_number = email.replace("@eco.play", "")
        else:
            medical_record_number = current_user["uid"]  # fallback to UID

        db = get_firestore_client()
        query = db.collection("trust_game").where(
            "user_id", "==", medical_record_number
        )  # UID 대신 Medical Record Number 사용

        if role:
            query = query.where("role", "==", role)

        docs = query.stream()

        rounds = []

        for doc in docs:
            data = doc.to_dict()

            try:
                # 프론트엔드가 기대하는 형태로 데이터 변환
                role = data.get("role")

                # 역할별로 다른 매핑 적용
                if role == "trustor":  # 투자하는 사람
                    # trustor의 손익 = 받은 금액 - 투자한 금액
                    investment = data.get("decision", 0)
                    received_back = data.get(
                        "received_amount", 0
                    )  # Firebase에는 received_amount 필드 존재
                    profit = received_back - investment

                    round_data = {
                        "round": data.get("round"),
                        "role": "trustor",  # 표준 용어 사용
                        "investment": investment,  # 투자한 금액
                        "received_amount": received_back,  # 돌려받은 금액
                        "return_amount": 0,  # trustor는 돌려주지 않음
                        "current_balance": profit,  # 순손익
                        "multiplied_amount": data.get("multiplied_amount", 0),
                        "response_time": data.get("response_time"),
                        "partner_id": data.get("partner_id"),
                        "game_name": data.get("game_name"),
                        "timestamp": data.get("timestamp"),
                    }
                elif role == "trustee":  # 받아서 돌려주는 사람
                    # trustee의 수익 = 받은 금액 - 돌려준 금액
                    received = data.get("received_amount", 0)
                    returned = data.get("decision", 0)
                    profit = received - returned

                    round_data = {
                        "round": data.get("round"),
                        "role": "trustee",  # 표준 용어 사용
                        "investment": 0,  # trustee는 투자하지 않음
                        "received_amount": received,  # 받은 금액
                        "return_amount": returned,  # 돌려준 금액
                        "current_balance": profit,  # 순수익
                        "multiplied_amount": data.get("multiplied_amount", 0),
                        "response_time": data.get("response_time"),
                        "partner_id": data.get("partner_id"),
                        "game_name": data.get("game_name"),
                        "timestamp": data.get("timestamp"),
                    }
                else:
                    # 기본값 (예상치 못한 역할)
                    round_data = {
                        "round": data.get("round"),
                        "role": role,
                        "investment": data.get("decision", 0),
                        "received_amount": data.get("received_amount", 0),
                        "return_amount": data.get("decision", 0),
                        "current_balance": 0,  # 기본값
                        "multiplied_amount": data.get("multiplied_amount", 0),
                        "response_time": data.get("response_time"),
                        "partner_id": data.get("partner_id"),
                        "game_name": data.get("game_name"),
                        "timestamp": data.get("timestamp"),
                    }
                rounds.append(round_data)

            except Exception as doc_error:
                raise doc_error

        # 라운드별 정렬
        rounds.sort(key=lambda x: x.get("round", 0))

        # 변환된 역할로 통계 계산
        trustor_rounds = [
            r for r in rounds if r.get("role") == "trustor"
        ]  # 투자하는 사람
        trustee_rounds = [
            r for r in rounds if r.get("role") == "trustee"
        ]  # 받아서 돌려주는 사람

        summary = {
            "total_rounds": len(rounds),
            "trustor_stats": {
                "rounds": len(trustor_rounds),
                "total_investment": sum(
                    r.get("investment", 0)
                    for r in trustor_rounds
                    if r.get("investment") is not None
                ),
                "average_investment": (
                    sum(
                        r.get("investment", 0)
                        for r in trustor_rounds
                        if r.get("investment") is not None
                    )
                    / len(trustor_rounds)
                )
                if trustor_rounds
                else 0,
            },
            "trustee_stats": {
                "rounds": len(trustee_rounds),
                "total_received": sum(
                    r.get("received_amount", 0)
                    for r in trustee_rounds
                    if r.get("received_amount") is not None
                ),
                "total_returned": sum(
                    r.get("return_amount", 0)
                    for r in trustee_rounds
                    if r.get("return_amount") is not None
                ),
                "average_return_rate": (
                    sum(
                        (
                            r.get("return_amount", 0) / r.get("received_amount", 1)
                            if r.get("received_amount", 0) > 0
                            else 0
                        )
                        for r in trustee_rounds
                        if r.get("return_amount") is not None
                        and r.get("received_amount") is not None
                    )
                    / len(trustee_rounds)
                )
                if trustee_rounds
                else 0,
            },
        }

        return {"summary": summary, "rounds": rounds}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"신뢰 게임 리포트 조회 중 오류: {str(e)}"
        )


@router.get("/all")
async def get_all_games_report(current_user=Depends(get_current_user_optional)):
    """모든 게임의 종합 리포트"""
    try:
        # 각 게임별 리포트 가져오기
        public_goods_report = await get_public_goods_report(current_user)
        trust_game_report = await get_trust_game_report(None, current_user)

        total_rounds = (
            public_goods_report["summary"]["total_rounds"]
            + trust_game_report["summary"]["total_rounds"]
        )

        overall_summary = {
            "total_rounds": total_rounds,
            "public_goods_payoff": public_goods_report["summary"]["total_payoff"],
            "games_played": {
                "public_goods": public_goods_report["summary"]["total_rounds"],
                "trust_game": trust_game_report["summary"]["total_rounds"],
            },
        }

        return {
            "overall_summary": overall_summary,
            "public_goods": public_goods_report,
            "trust_game": trust_game_report,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"종합 리포트 조회 중 오류: {str(e)}"
        )
