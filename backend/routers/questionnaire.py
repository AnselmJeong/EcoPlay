from fastapi import APIRouter, HTTPException, Depends, Request
from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel
import os

from core.firebase import get_firestore_client, verify_id_token

router = APIRouter(prefix="/questionnaire", tags=["questionnaire"])

DEVELOPMENT = os.getenv("ENVIRONMENT", "development") == "development"
QUESTIONNAIRE_ALIASES = {
    "demographic": {"demographic", "인구학적 정보"},
    "pcl_k5": {"pcl_k5", "PTSD 척도"},
}


class QuestionnaireSubmitRequest(BaseModel):
    medicalRecordNumber: str
    answers: dict[str, Any]
    questionnaireName: Optional[str] = None
    completed: bool = False


def has_questionnaire(saved_questionnaires: list[str], questionnaire_key: str) -> bool:
    aliases = QUESTIONNAIRE_ALIASES.get(questionnaire_key, {questionnaire_key})
    return any(item in aliases for item in saved_questionnaires)


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

        query = list(
            db.collection("questionnaire")
            .where("user_id", "==", request.medicalRecordNumber)
            .limit(1)
            .stream()
        )

        existing_doc = query[0] if query else None
        existing_data = existing_doc.to_dict() if existing_doc else {}
        existing_answers = existing_data.get("answers", {})
        saved_questionnaires = existing_data.get("saved_questionnaires", [])

        if request.questionnaireName and request.questionnaireName not in saved_questionnaires:
            saved_questionnaires.append(request.questionnaireName)

        data = {
            "user_id": request.medicalRecordNumber,
            "firebase_uid": current_user["uid"],
            "answers": {
                **existing_answers,
                **request.answers,
            },
            "saved_questionnaires": saved_questionnaires,
            "completed": existing_data.get("completed", False) or request.completed,
            "updated_at": datetime.utcnow(),
        }

        if existing_doc:
            if not existing_data.get("submitted_at"):
                data["submitted_at"] = datetime.utcnow() if request.completed else None
            elif request.completed:
                data["submitted_at"] = datetime.utcnow()

            db.collection("questionnaire").document(existing_doc.id).set(
                {k: v for k, v in data.items() if v is not None},
                merge=True,
            )
            document_id = existing_doc.id
        else:
            if request.completed:
                data["submitted_at"] = datetime.utcnow()
            else:
                data["created_at"] = datetime.utcnow()

            doc_ref = db.collection("questionnaire").add(
                {k: v for k, v in data.items() if v is not None}
            )
            document_id = doc_ref[1].id

        return {
            "success": True,
            "document_id": document_id,
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
            return {
                "completed": False,
                "demographic_completed": False,
                "saved_questionnaires": [],
            }

        latest = docs[0].to_dict()
        saved_questionnaires = latest.get("saved_questionnaires", [])
        return {
            "completed": latest.get("completed", False),
            "demographic_completed": has_questionnaire(
                saved_questionnaires, "demographic"
            ),
            "saved_questionnaires": saved_questionnaires,
            "submitted_at": latest.get("submitted_at"),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"설문지 확인 중 오류: {str(e)}")


@router.get("/detail/{medical_record_number}")
async def get_questionnaire_detail(
    medical_record_number: str,
    current_user=Depends(get_current_user_optional),
):
    """설문지 저장 상세 조회"""
    try:
        db = get_firestore_client()

        docs = list(
            db.collection("questionnaire")
            .where("user_id", "==", medical_record_number)
            .limit(1)
            .stream()
        )

        if not docs:
            return {
                "exists": False,
                "answers": {},
                "completed": False,
                "demographic_completed": False,
                "saved_questionnaires": [],
            }

        latest = docs[0].to_dict()
        saved_questionnaires = latest.get("saved_questionnaires", [])
        return {
            "exists": True,
            "answers": latest.get("answers", {}),
            "completed": latest.get("completed", False),
            "demographic_completed": has_questionnaire(
                saved_questionnaires, "demographic"
            ),
            "saved_questionnaires": saved_questionnaires,
            "submitted_at": latest.get("submitted_at"),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"설문지 상세 조회 중 오류: {str(e)}")
