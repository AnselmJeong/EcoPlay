import os
from typing import Optional

from fastapi import HTTPException, Request, status

from core.firebase import verify_id_token

DEVELOPMENT = os.getenv("ENVIRONMENT", "production").strip().lower() == "development"


def build_dev_user() -> dict:
    return {
        "uid": "12345678",
        "email": "12345678@eco.play",
        "auth_time": 1234567890,
        "iss": "https://securetoken.google.com/ecoplay-6fd53",
        "aud": "ecoplay-6fd53",
    }


def extract_medical_record_number(current_user: dict) -> str:
    email = current_user.get("email", "")
    if email.endswith("@eco.play"):
        return email.removesuffix("@eco.play")
    return current_user["uid"]


def require_matching_medical_record_number(
    current_user: dict,
    medical_record_number: str,
) -> str:
    """Ensure a participant can only address their own research record."""
    authenticated_number = extract_medical_record_number(current_user)
    if medical_record_number != authenticated_number:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own participant record",
        )
    return authenticated_number


async def get_current_user_optional(request: Request) -> Optional[dict]:
    auth_header = request.headers.get("Authorization")

    if DEVELOPMENT and not auth_header:
        return build_dev_user()

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    id_token = auth_header.split(" ", 1)[1]
    try:
        return verify_id_token(id_token)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid Firebase token") from exc


async def get_current_user(request: Request) -> dict:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid token",
        )

    id_token = auth_header.split(" ", 1)[1]
    try:
        return verify_id_token(id_token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase token",
        ) from exc
