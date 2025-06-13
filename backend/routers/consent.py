from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel
import os

# 스키마 임시 제거 - 인라인으로 정의
from core.firebase import get_firestore_client, verify_id_token

router = APIRouter(prefix="/consent", tags=["consent"])

# 개발 환경 확인
DEVELOPMENT = os.getenv("ENVIRONMENT", "development") == "development"


# 동의서 스키마
class ConsentDetails(BaseModel):
    researchParticipation: bool
    dataCollection: bool
    dataSharing: bool
    contactPermission: bool


class ConsentRequest(BaseModel):
    medicalRecordNumber: str
    consentGiven: bool
    consentDetails: ConsentDetails


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


@router.post("/submit")
async def submit_consent(
    request: ConsentRequest, current_user=Depends(get_current_user_optional)
):
    """동의서 제출"""
    try:
        db = get_firestore_client()

        consent_data = {
            "user_id": request.medicalRecordNumber,
            "user_email": f"{request.medicalRecordNumber}@eco.play",
            "consent_given": request.consentGiven,
            "consent_details": request.consentDetails.dict(),
            "consent_timestamp": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "firebase_uid": current_user["uid"],
        }

        doc_ref = db.collection("basic_info").add(consent_data)

        return {
            "success": True,
            "document_id": doc_ref[1].id,
            "message": "동의서가 성공적으로 제출되었습니다.",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"동의서 제출 중 오류: {str(e)}")


@router.get("/check/{medical_record_number}")
async def check_consent(
    medical_record_number: str, current_user=Depends(get_current_user_optional)
):
    """동의서 상태 확인"""
    try:
        db = get_firestore_client()

        query = db.collection("basic_info").where(
            "user_id", "==", medical_record_number
        )
        docs = list(query.stream())

        if not docs:
            return {"exists": False, "message": "동의서가 제출되지 않았습니다."}

        # 가장 최근 동의서 가져오기
        latest_doc = docs[0]
        data = latest_doc.to_dict()

        return {
            "exists": True,
            "consent_given": data.get("consent_given", False),
            "consent_details": data.get("consent_details", {}),
            "consent_timestamp": data.get("consent_timestamp"),
            "document_id": latest_doc.id,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"동의서 확인 중 오류: {str(e)}")


@router.get("/list")
async def get_consent_list(current_user=Depends(get_current_user_optional)):
    """사용자의 모든 동의서 목록 조회"""
    try:
        db = get_firestore_client()

        # Firebase UID로 조회
        query = db.collection("basic_info").where(
            "firebase_uid", "==", current_user["uid"]
        )
        docs = query.stream()

        consents = []
        for doc in docs:
            data = doc.to_dict()
            consents.append(
                {
                    "document_id": doc.id,
                    "user_id": data.get("user_id"),
                    "consent_given": data.get("consent_given"),
                    "consent_details": data.get("consent_details"),
                    "consent_timestamp": data.get("consent_timestamp"),
                    "created_at": data.get("created_at"),
                }
            )

        # 시간순 정렬 (최신순)
        consents.sort(key=lambda x: x.get("created_at") or datetime.min, reverse=True)

        return {"consents": consents, "total": len(consents)}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"동의서 목록 조회 중 오류: {str(e)}"
        )


@router.put("/update/{document_id}")
async def update_consent(
    document_id: str,
    request: ConsentRequest,
    current_user=Depends(get_current_user_optional),
):
    """동의서 수정"""
    try:
        db = get_firestore_client()

        # 문서 존재 확인
        doc_ref = db.collection("basic_info").document(document_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="동의서를 찾을 수 없습니다.")

        # 권한 확인 (본인의 동의서인지)
        doc_data = doc.to_dict()
        if doc_data.get("firebase_uid") != current_user["uid"]:
            raise HTTPException(status_code=403, detail="동의서 수정 권한이 없습니다.")

        # 업데이트 데이터
        update_data = {
            "consent_given": request.consentGiven,
            "consent_details": request.consentDetails.dict(),
            "updated_at": datetime.utcnow(),
        }

        doc_ref.update(update_data)

        return {
            "success": True,
            "document_id": document_id,
            "message": "동의서가 성공적으로 수정되었습니다.",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"동의서 수정 중 오류: {str(e)}")


@router.delete("/delete/{document_id}")
async def delete_consent(
    document_id: str, current_user=Depends(get_current_user_optional)
):
    """동의서 삭제"""
    try:
        db = get_firestore_client()

        # 문서 존재 확인
        doc_ref = db.collection("basic_info").document(document_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(status_code=404, detail="동의서를 찾을 수 없습니다.")

        # 권한 확인 (본인의 동의서인지)
        doc_data = doc.to_dict()
        if doc_data.get("firebase_uid") != current_user["uid"]:
            raise HTTPException(status_code=403, detail="동의서 삭제 권한이 없습니다.")

        doc_ref.delete()

        return {
            "success": True,
            "document_id": document_id,
            "message": "동의서가 성공적으로 삭제되었습니다.",
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"동의서 삭제 중 오류: {str(e)}")
