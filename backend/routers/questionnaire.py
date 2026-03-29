from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel
import os

from core.firebase import get_firestore_client, verify_id_token

router = APIRouter(prefix="/questionnaire", tags=["questionnaire"])

DEVELOPMENT = os.getenv("ENVIRONMENT", "development") == "development"


class QuestionnaireSubmitRequest(BaseModel):
    medicalRecordNumber: str
    answers: dict[str, Any]


async def get_current_user_optional(request: Request) -> Optional[dict]:
    auth_header = request.headers.get("Authorization")

    if DEVELOPMENT and not auth_header:
        return {
            "uid": "12345678",
            "email": "12345678@eco.play",
        }

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    id_token = auth_header.split(" ", 1)[1]
    try:
        return verify_id_token(id_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Firebase token: {str(e)}")


@router.post("/submit")
async def submit_questionnaire(
    request: QuestionnaireSubmitRequest,
    current_user=Depends(get_current_user_optional),
):
    """설문지 응답 저장"""
    try:
        db = get_firestore_client()

        data = {
            "user_id": request.medicalRecordNumber,
            "firebase_uid": current_user["uid"],
            "answers": request.answers,
            "submitted_at": datetime.utcnow(),
        }

        doc_ref = db.collection("questionnaire").add(data)

        return {
            "success": True,
            "document_id": doc_ref[1].id,
            "message": "설문지가 성공적으로 제출되었습니다.",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"설문지 제출 중 오류: {str(e)}")


@router.get("/check/{medical_record_number}")
async def check_questionnaire(
    medical_record_number: str,
    current_user=Depends(get_current_user_optional),
):
    """설문지 완료 여부 확인"""
    try:
        db = get_firestore_client()

        docs = list(
            db.collection("questionnaire")
            .where("user_id", "==", medical_record_number)
            .stream()
        )

        if not docs:
            return {"completed": False}

        latest = docs[0].to_dict()
        return {
            "completed": True,
            "submitted_at": latest.get("submitted_at"),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"설문지 확인 중 오류: {str(e)}")
