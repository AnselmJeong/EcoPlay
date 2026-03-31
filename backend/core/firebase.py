import firebase_admin
from firebase_admin import credentials, auth, firestore
from typing import Optional
import os
import logging
from pathlib import Path

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECRET_DIR = Path(__file__).resolve().parent.parent / "secret"
DEFAULT_CRED_PATH = SECRET_DIR / "ecoplay.json"
LEGACY_CRED_PATH = SECRET_DIR / "ecoplay.json"

firebase_app: Optional[firebase_admin.App] = None


def get_credential_path() -> Path:
    if DEFAULT_CRED_PATH.exists():
        return DEFAULT_CRED_PATH
    return LEGACY_CRED_PATH


def init_firebase() -> firebase_admin.App:
    global firebase_app
    try:
        if not firebase_admin._apps:
            cred_path = get_credential_path()
            logger.info(f"Firebase 초기화 시작. Credential 경로: {cred_path}")

            # credential 파일 존재 확인
            if not cred_path.exists():
                logger.error(f"Credential 파일을 찾을 수 없습니다: {cred_path}")
                raise FileNotFoundError(
                    f"Credential 파일을 찾을 수 없습니다: {cred_path}"
                )

            cred = credentials.Certificate(str(cred_path))
            firebase_app = firebase_admin.initialize_app(cred)
            logger.info("Firebase 초기화 완료")
        else:
            firebase_app = firebase_admin.get_app()
            logger.info("기존 Firebase 앱 사용")

        return firebase_app
    except Exception as e:
        logger.error(f"Firebase 초기화 오류: {str(e)}")
        raise


def get_firestore_client() -> firestore.Client:
    if not firebase_admin._apps:
        init_firebase()
    return firestore.client()


def verify_id_token(id_token: str) -> dict:
    try:
        if not firebase_admin._apps:
            logger.info("Firebase 초기화되지 않음. 초기화 시도...")
            init_firebase()

        logger.info("토큰 검증 시작")
        decoded_token = auth.verify_id_token(id_token)
        logger.info(f"토큰 검증 성공. UID: {decoded_token.get('uid', 'Unknown')}")
        return decoded_token
    except Exception as e:
        logger.error(f"토큰 검증 실패: {str(e)}")
        logger.error(
            f"토큰: {id_token[:50]}..." if len(id_token) > 50 else f"토큰: {id_token}"
        )
        raise
