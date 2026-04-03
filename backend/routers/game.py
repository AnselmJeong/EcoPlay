from fastapi import APIRouter, Depends

from core.auth import extract_medical_record_number, get_current_user_optional
from core.firebase import get_firestore_client
from schemas.game import (
    PublicGoodsSubmitTrialRequest,
    PublicGoodsSubmitTrialResponse,
    RTGPostBlockRequest,
    RTGPostBlockResponse,
    RTGSubmitTrialRequest,
    RTGSubmitTrialResponse,
    RTGTutorialComprehensionRequest,
    RTGTutorialComprehensionResponse,
    RTGTutorialSubmitTrialRequest,
    RTGTutorialSubmitTrialResponse,
    SessionStartResponse,
)
from services.game_sessions import (
    PGGSessionService,
    RTGSessionService,
    RTGTutorialService,
)


router = APIRouter(prefix="/game", tags=["game"])


@router.post("/pgg/start-session", response_model=SessionStartResponse)
async def start_pgg_session(current_user=Depends(get_current_user_optional)):
    db = get_firestore_client()
    service = PGGSessionService(db)
    user_id = extract_medical_record_number(current_user)
    return {"session": service.start_session(user_id)}


@router.get("/pgg/session/{session_id}", response_model=SessionStartResponse)
async def get_pgg_session(session_id: str, current_user=Depends(get_current_user_optional)):
    db = get_firestore_client()
    service = PGGSessionService(db)
    user_id = extract_medical_record_number(current_user)
    return {"session": service.get_session(user_id, session_id)}


@router.post("/pgg/submit-trial", response_model=PublicGoodsSubmitTrialResponse)
async def submit_pgg_trial(
    request: PublicGoodsSubmitTrialRequest,
    current_user=Depends(get_current_user_optional),
):
    db = get_firestore_client()
    service = PGGSessionService(db)
    user_id = extract_medical_record_number(current_user)
    return service.submit_trial(
        user_id=user_id,
        session_id=request.session_id,
        contribution=request.contribution,
        response_time_ms=request.response_time_ms,
    )


@router.post("/rtg/tutorial/start", response_model=SessionStartResponse)
async def start_rtg_tutorial(current_user=Depends(get_current_user_optional)):
    db = get_firestore_client()
    service = RTGTutorialService(db)
    user_id = extract_medical_record_number(current_user)
    return {"session": service.start_session(user_id)}


@router.get("/rtg/tutorial/session/{session_id}", response_model=SessionStartResponse)
async def get_rtg_tutorial_session(
    session_id: str,
    current_user=Depends(get_current_user_optional),
):
    db = get_firestore_client()
    service = RTGTutorialService(db)
    user_id = extract_medical_record_number(current_user)
    return {"session": service.get_session(user_id, session_id)}


@router.post("/rtg/tutorial/submit-trial", response_model=RTGTutorialSubmitTrialResponse)
async def submit_rtg_tutorial_trial(
    request: RTGTutorialSubmitTrialRequest,
    current_user=Depends(get_current_user_optional),
):
    db = get_firestore_client()
    service = RTGTutorialService(db)
    user_id = extract_medical_record_number(current_user)
    return service.submit_trial(
        user_id=user_id,
        session_id=request.session_id,
        return_amount=request.return_amount,
        response_time_ms=request.response_time_ms,
    )


@router.post(
    "/rtg/tutorial/comprehension-check",
    response_model=RTGTutorialComprehensionResponse,
)
async def submit_rtg_tutorial_comprehension(
    request: RTGTutorialComprehensionRequest,
    current_user=Depends(get_current_user_optional),
):
    db = get_firestore_client()
    service = RTGTutorialService(db)
    user_id = extract_medical_record_number(current_user)
    return service.submit_comprehension(
        user_id=user_id,
        session_id=request.session_id,
        multiplier_answer=request.multiplier_answer,
        return_basis_answer=request.return_basis_answer,
        repeated_interaction_answer=request.repeated_interaction_answer,
    )


@router.post("/rtg/start-session", response_model=SessionStartResponse)
async def start_rtg_session(current_user=Depends(get_current_user_optional)):
    db = get_firestore_client()
    service = RTGSessionService(db)
    user_id = extract_medical_record_number(current_user)
    return {"session": service.start_session(user_id)}


@router.get("/rtg/session/{session_id}", response_model=SessionStartResponse)
async def get_rtg_session(session_id: str, current_user=Depends(get_current_user_optional)):
    db = get_firestore_client()
    service = RTGSessionService(db)
    user_id = extract_medical_record_number(current_user)
    return {"session": service.get_session(user_id, session_id)}


@router.post("/rtg/submit-trial", response_model=RTGSubmitTrialResponse)
async def submit_rtg_trial(
    request: RTGSubmitTrialRequest,
    current_user=Depends(get_current_user_optional),
):
    db = get_firestore_client()
    service = RTGSessionService(db)
    user_id = extract_medical_record_number(current_user)
    return service.submit_trial(
        user_id=user_id,
        session_id=request.session_id,
        amount_sent=request.amount_sent,
        response_time_ms=request.response_time_ms,
    )


@router.post("/rtg/post-block", response_model=RTGPostBlockResponse)
async def submit_rtg_post_block(
    request: RTGPostBlockRequest,
    current_user=Depends(get_current_user_optional),
):
    db = get_firestore_client()
    service = RTGSessionService(db)
    user_id = extract_medical_record_number(current_user)
    return service.submit_post_block(
        user_id=user_id,
        session_id=request.session_id,
        partner_classification_response=request.partner_classification_response,
        classification_confidence=request.classification_confidence,
        willingness_to_play_again=request.willingness_to_play_again,
    )
