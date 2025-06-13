import firebase_admin
from firebase_admin import credentials, auth, firestore
from typing import Optional
import os

# credentials 경로
CRED_PATH = os.path.join(os.path.dirname(__file__), "../secret/ecoplay.json")

firebase_app: Optional[firebase_admin.App] = None


def init_firebase() -> firebase_admin.App:
    global firebase_app
    if not firebase_admin._apps:
        cred = credentials.Certificate(CRED_PATH)
        firebase_app = firebase_admin.initialize_app(cred)
    else:
        firebase_app = firebase_admin.get_app()
    return firebase_app


def get_firestore_client() -> firestore.Client:
    if not firebase_admin._apps:
        init_firebase()
    return firestore.client()


def verify_id_token(id_token: str) -> dict:
    if not firebase_admin._apps:
        init_firebase()
    return auth.verify_id_token(id_token)
