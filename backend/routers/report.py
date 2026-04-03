from fastapi import APIRouter, Depends

from core.auth import extract_medical_record_number, get_current_user_optional
from core.firebase import get_firestore_client
from core.game_config import get_game_config
from services.game_sessions import (
    PGG_SESSIONS,
    PGG_TRIALS,
    RTG_POST_BLOCKS,
    RTG_SESSIONS,
    RTG_TRIALS,
    RTG_TUTORIAL_SESSIONS,
    RTG_TUTORIAL_TRIALS,
    latest_completed_session,
    sorted_docs,
)


router = APIRouter(prefix="/report", tags=["report"])


def _latest_session_report(db, collection_name: str, user_id: str):
    return latest_completed_session(db, collection_name, user_id)


@router.get("/public-goods")
async def get_public_goods_report(current_user=Depends(get_current_user_optional)):
    db = get_firestore_client()
    config = get_game_config()
    user_id = extract_medical_record_number(current_user)
    session = _latest_session_report(db, PGG_SESSIONS, user_id)

    if session is None:
        return {"summary": None, "session": None, "rounds": []}

    rounds = sorted_docs(
        db.collection(PGG_TRIALS).where("session_id", "==", session["session_id"]).stream(),
        "pgg_trial_index",
    )
    summary = {
        "total_rounds": len(rounds),
        "expected_rounds": config.pgg.trials,
        "total_contribution": round(sum(item["pgg_contribution"] for item in rounds), 2),
        "total_feedback": round(sum(item["pgg_feedback_amount"] for item in rounds), 2),
        "cumulative_payoff": session["cumulative_payoff"],
    }
    return {"summary": summary, "session": session, "rounds": rounds}


@router.get("/rtg-tutorial")
async def get_rtg_tutorial_report(current_user=Depends(get_current_user_optional)):
    db = get_firestore_client()
    config = get_game_config()
    user_id = extract_medical_record_number(current_user)
    session = _latest_session_report(db, RTG_TUTORIAL_SESSIONS, user_id)

    if session is None:
        return {"summary": None, "session": None, "rounds": []}

    rounds = sorted_docs(
        db.collection(RTG_TUTORIAL_TRIALS)
        .where("session_id", "==", session["session_id"])
        .stream(),
        "trial_index",
    )
    summary = {
        "total_rounds": len(rounds),
        "expected_rounds": config.tutorial.trials,
        "tutorial_completed": session["tutorial_completed"],
        "comprehension_check_passed": session["comprehension_check_passed"],
    }
    return {"summary": summary, "session": session, "rounds": rounds}


@router.get("/trust-game")
async def get_rtg_report(current_user=Depends(get_current_user_optional)):
    db = get_firestore_client()
    config = get_game_config()
    user_id = extract_medical_record_number(current_user)
    session = _latest_session_report(db, RTG_SESSIONS, user_id)

    if session is None:
        return {"summary": None, "session": None, "rounds": [], "post_blocks": []}

    rounds = sorted_docs(
        db.collection(RTG_TRIALS).where("session_id", "==", session["session_id"]).stream(),
        "rtg_trial_index",
    )
    post_blocks = sorted_docs(
        db.collection(RTG_POST_BLOCKS)
        .where("session_id", "==", session["session_id"])
        .stream(),
        "rtg_block_index",
    )
    summary = {
        "total_rounds": len(rounds),
        "expected_rounds": config.rtg.trials_per_partner * len(config.rtg.partners),
        "total_blocks": len(post_blocks),
        "expected_blocks": len(config.rtg.partners),
        "cumulative_payoff": session["cumulative_payoff"],
        "mean_amount_sent": round(
            sum(item["amount_sent"] for item in rounds) / len(rounds), 2
        )
        if rounds
        else 0.0,
        "mean_partner_return_amount": round(
            sum(item["partner_return_amount"] for item in rounds) / len(rounds),
            2,
        )
        if rounds
        else 0.0,
    }
    return {
        "summary": summary,
        "session": session,
        "rounds": rounds,
        "post_blocks": post_blocks,
    }


@router.get("/all")
async def get_all_game_report(current_user=Depends(get_current_user_optional)):
    db = get_firestore_client()
    config = get_game_config()
    user_id = extract_medical_record_number(current_user)

    pgg_session = _latest_session_report(db, PGG_SESSIONS, user_id)
    tutorial_session = _latest_session_report(db, RTG_TUTORIAL_SESSIONS, user_id)
    rtg_session = _latest_session_report(db, RTG_SESSIONS, user_id)
    tutorial_passed = bool(
        tutorial_session and tutorial_session.get("comprehension_check_passed")
    )

    pgg_completed = pgg_session["completed_trials_count"] if pgg_session else 0
    tutorial_completed = tutorial_session["completed_trials_count"] if tutorial_session else 0
    rtg_completed = rtg_session["completed_trials_count"] if rtg_session else 0

    total_expected = (
        config.pgg.trials
        + config.tutorial.trials
        + config.rtg.trials_per_partner * len(config.rtg.partners)
    )
    total_completed = pgg_completed + tutorial_completed + rtg_completed

    return {
        "overall_summary": {
            "games_played": {
                "public_goods": pgg_completed,
                "rtg_tutorial": tutorial_completed,
                "trust_game": rtg_completed,
            },
            "sessions_completed": {
                "public_goods": pgg_session is not None,
                "rtg_tutorial": tutorial_passed,
                "trust_game": rtg_session is not None,
            },
            "questionnaire_ready": pgg_session is not None and tutorial_passed and rtg_session is not None,
            "completed_rounds": total_completed,
            "expected_rounds": total_expected,
            "overall_percentage": round((total_completed / total_expected) * 100, 2)
            if total_expected
            else 0.0,
        }
    }


@router.get("/games")
async def get_game_report(current_user=Depends(get_current_user_optional)):
    return await get_all_game_report(current_user=current_user)
