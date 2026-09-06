from copy import deepcopy
from datetime import datetime
from unittest.mock import patch

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from core.auth import get_current_user_optional
from routers.game import router
from services.game_sessions import (
    RTG_SESSIONS,
    RTG_TUTORIAL_SESSIONS,
    RTGTutorialService,
)
from test_session_replacement import FakeFirestore


def passed_tutorial(**overrides):
    return {
        "session_id": "tutorial",
        "user_id": "participant-1",
        "tutorial_completed": True,
        "comprehension_check_passed": True,
        "completed_trials_count": 10,
        "updated_at": datetime.utcnow(),
        **overrides,
    }


@pytest.fixture
def api():
    db = FakeFirestore({})
    app = FastAPI()
    app.include_router(router)
    app.dependency_overrides[get_current_user_optional] = lambda: {
        "uid": "participant-1",
    }
    with patch("routers.game.get_firestore_client", return_value=db), TestClient(app) as client:
        yield client, db


@pytest.mark.parametrize("tutorial", [
    None,
    passed_tutorial(tutorial_completed=False, completed_trials_count=9),
    passed_tutorial(comprehension_check_passed=False),
    passed_tutorial(completed_trials_count=9),
    passed_tutorial(completed_trials_count=0),
    passed_tutorial(status="invalidated"),
    passed_tutorial(status="abandoned"),
    passed_tutorial(invalidated_at=datetime.utcnow()),
    passed_tutorial(user_id="participant-2"),
])
def test_incomplete_tutorial_blocks_every_main_endpoint_without_writes(api, tutorial):
    client, db = api
    if tutorial:
        db.collection(RTG_TUTORIAL_SESSIONS).document("tutorial").set(tutorial)
    # An existing main session must not bypass the prerequisite, or be purged
    # by an unauthorized restart request.
    db.collection(RTG_SESSIONS).document("existing").set({
        "session_id": "existing", "user_id": "participant-1", "completed": False,
    })
    before = deepcopy({name: collection.documents for name, collection in db.collections.items()})

    assert client.get("/game/rtg/access").json() == {"allowed": False}
    responses = [
        client.post("/game/rtg/start-session", json={"replace_completed": True}),
        client.get("/game/rtg/session/existing"),
        client.post("/game/rtg/submit-trial", json={
            "session_id": "existing", "amount_sent": 0, "response_time_ms": 100,
        }),
        client.post("/game/rtg/post-block", json={
            "session_id": "existing", "partner_classification_response": "high_return",
            "classification_confidence": 5, "willingness_to_play_again": 5,
        }),
    ]
    for response in responses:
        assert response.status_code == 403, response.text
        assert response.json()["detail"]["code"] == "tutorial_required"
    for name, documents in before.items():
        assert db.collection(name).documents == documents


def test_unlocks_only_after_all_trials_and_all_quiz_answers_pass(api):
    client, db = api
    tutorial = client.post("/game/rtg/tutorial/start").json()["session"]
    session_id = tutorial["session_id"]
    for trial in range(10):
        assert client.get("/game/rtg/access").json() == {"allowed": False}
        if trial == 9:
            early_quiz = client.post("/game/rtg/tutorial/comprehension-check", json={
                "session_id": session_id, "multiplier_answer": 3,
                "return_basis_answer": "tripled_amount", "repeated_interaction_answer": True,
            })
            assert early_quiz.status_code == 400
        response = client.post("/game/rtg/tutorial/submit-trial", json={
            "session_id": session_id, "return_amount": 0, "response_time_ms": 100,
        })
        assert response.status_code == 200, response.text

    answers = {
        "session_id": session_id, "multiplier_answer": 3,
        "return_basis_answer": "tripled_amount", "repeated_interaction_answer": True,
    }
    for incorrect in [
        {"multiplier_answer": 2}, {"return_basis_answer": "original_amount"},
        {"repeated_interaction_answer": False},
    ]:
        response = client.post("/game/rtg/tutorial/comprehension-check", json={**answers, **incorrect})
        assert response.status_code == 200, response.text
        assert response.json()["passed"] is False
        assert client.get("/game/rtg/access").json() == {"allowed": False}
        assert client.post("/game/rtg/start-session").status_code == 403

    assert client.post("/game/rtg/tutorial/comprehension-check", json=answers).json()["passed"] is True
    assert client.get("/game/rtg/access").json() == {"allowed": True}
    response = client.post("/game/rtg/start-session")
    assert response.status_code == 200, response.text
    main_id = response.json()["session"]["session_id"]
    assert client.get(f"/game/rtg/session/{main_id}").status_code == 200
    assert client.post("/game/rtg/submit-trial", json={
        "session_id": main_id, "amount_sent": 0, "response_time_ms": 100,
    }).status_code == 200

    # Restarting the completed tutorial invalidates its previous pass. Existing
    # main sessions must also become inaccessible until the new attempt passes.
    RTGTutorialService(db).start_session("participant-1", replace_completed=True)
    assert client.get("/game/rtg/access").json() == {"allowed": False}
    assert client.get(f"/game/rtg/session/{main_id}").status_code == 403
    assert client.post("/game/rtg/submit-trial", json={
        "session_id": main_id, "amount_sent": 0, "response_time_ms": 100,
    }).status_code == 403
