import logging
import os
from pathlib import Path
from typing import Optional

import firebase_admin
from firebase_admin import auth, credentials, firestore

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECRET_DIR = Path(__file__).resolve().parent.parent / "secret"
DEFAULT_CRED_PATH = SECRET_DIR / "ecoplay.json"

firebase_app: Optional[firebase_admin.App] = None


def get_local_credential_path() -> Path | None:
    """Return the local development key when one is available.

    Cloud Run must use Application Default Credentials from its service account,
    so the JSON key is only a local-development fallback.
    """
    return DEFAULT_CRED_PATH if DEFAULT_CRED_PATH.exists() else None


def init_firebase() -> firebase_admin.App:
    global firebase_app
    try:
        if not firebase_admin._apps:
            cred_path = get_local_credential_path()
            if cred_path is not None and not os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
                logger.info("로컬 Firebase service account로 초기화합니다.")
                cred = credentials.Certificate(str(cred_path))
                firebase_app = firebase_admin.initialize_app(cred)
            else:
                logger.info("Application Default Credentials로 Firebase를 초기화합니다.")
                firebase_app = firebase_admin.initialize_app()
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

        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        # ID tokens are credentials and must never be copied into logs.
        logger.warning("Firebase ID token 검증에 실패했습니다: %s", type(e).__name__)
        raise
