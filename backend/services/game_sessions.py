from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import uuid4
import random

from fastapi import HTTPException

from core.game_config import get_game_config
from engine.partner import PartnerEngine
from engine.pgg import PGGEngine


PGG_SESSIONS = "pgg_sessions"
PGG_TRIALS = "pgg_trials"
RTG_TUTORIAL_SESSIONS = "rtg_tutorial_sessions"
RTG_TUTORIAL_TRIALS = "rtg_tutorial_trials"
RTG_SESSIONS = "rtg_sessions"
RTG_TRIALS = "rtg_trials"
RTG_POST_BLOCKS = "rtg_post_blocks"

PARTNER_CLASSIFICATION_MAP = {
    1: "high_return",
    2: "low_return",
    3: "unpredictable",
}


def utcnow() -> datetime:
    return datetime.utcnow()


def build_session_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex}"


def get_document_or_404(doc_ref, detail: str):
    doc = doc_ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail=detail)
    return doc.to_dict()


def sorted_docs(stream, sort_key: str) -> list[dict[str, Any]]:
    docs = [doc.to_dict() for doc in stream]
    return sorted(docs, key=lambda item: item.get(sort_key, 0))


class PGGSessionService:
    def __init__(self, db):
        self.db = db
        self.config = get_game_config()

    def _get_previous_participant_contribution(self, session_id: str, trial_index: int) -> float | None:
        if trial_index <= 1:
            return None

        previous_trial_docs = (
            self.db.collection(PGG_TRIALS)
            .where("session_id", "==", session_id)
            .where("pgg_trial_index", "==", trial_index - 1)
            .limit(1)
            .stream()
        )
        previous_trial = next(previous_trial_docs, None)
        if previous_trial is None:
            return None

        return float(previous_trial.to_dict()["pgg_contribution"])

    def start_session(self, user_id: str) -> dict[str, Any]:
        session_id = build_session_id("pgg")
        seed = random.randint(1, 2_147_483_647)
        session_data = {
            "session_id": session_id,
            "user_id": user_id,
            "game_type": "pgg",
            "config_version": self.config.version,
            "seed": seed,
            "completed_trials_count": 0,
            "cumulative_payoff": 0.0,
            "completed": False,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }
        self.db.collection(PGG_SESSIONS).document(session_id).set(session_data)
        return self.get_session(user_id, session_id)

    def get_session(self, user_id: str, session_id: str) -> dict[str, Any]:
        session = get_document_or_404(
            self.db.collection(PGG_SESSIONS).document(session_id),
            "PGG session not found.",
        )
        if session["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="This session belongs to another user.")

        next_trial_index = session["completed_trials_count"] + 1
        return {
            "session_id": session["session_id"],
            "phase": "completed" if session["completed"] else "trial",
            "config_version": session["config_version"],
            "endowment": self.config.pgg.endowment,
            "group_size": self.config.pgg.group_size,
            "multiplier": self.config.pgg.multiplier,
            "total_trials": self.config.pgg.trials,
            "completed_trials_count": session["completed_trials_count"],
            "cumulative_payoff": session["cumulative_payoff"],
            "current_trial_index": None if session["completed"] else next_trial_index,
        }

    def submit_trial(
        self,
        user_id: str,
        session_id: str,
        contribution: float,
        response_time_ms: int,
    ) -> dict[str, Any]:
        session_ref = self.db.collection(PGG_SESSIONS).document(session_id)
        session = get_document_or_404(session_ref, "PGG session not found.")
        if session["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="This session belongs to another user.")
        if session["completed"]:
            raise HTTPException(status_code=400, detail="PGG session is already completed.")

        if not 0 <= contribution <= self.config.pgg.endowment:
            raise HTTPException(status_code=400, detail="Contribution must stay within the trial endowment.")

        trial_index = session["completed_trials_count"] + 1
        engine = PGGEngine(self.config.pgg, session["seed"])
        previous_participant_contribution = self._get_previous_participant_contribution(session_id, trial_index)
        trial_result = engine.simulate_trial(
            contribution,
            trial_index,
            previous_participant_contribution=previous_participant_contribution,
        )
        cumulative_payoff = round(session["cumulative_payoff"] + trial_result.participant_trial_payoff, 2)

        trial_data = {
            "session_id": session_id,
            "user_id": user_id,
            "config_version": session["config_version"],
            "pgg_trial_index": trial_index,
            "pgg_group_id": f"{session_id}_group",
            "pgg_endowment": self.config.pgg.endowment,
            "pgg_contribution": contribution,
            "pgg_keep_amount": trial_result.participant_keep_amount,
            "pgg_group_total_contribution": trial_result.total_contribution,
            "pgg_feedback_amount": trial_result.feedback_amount,
            "pgg_response_time_ms": response_time_ms,
            "pgg_simulated_contributions": trial_result.other_contributions,
            "participant_total_payoff_this_trial": trial_result.participant_trial_payoff,
            "cumulative_payoff": cumulative_payoff,
            "algorithm_version": engine.algorithm_version,
            "created_at": utcnow(),
        }
        self.db.collection(PGG_TRIALS).add(trial_data)

        completed_trials_count = trial_index
        completed = completed_trials_count >= self.config.pgg.trials
        session_ref.update(
            {
                "completed_trials_count": completed_trials_count,
                "cumulative_payoff": cumulative_payoff,
                "completed": completed,
                "updated_at": utcnow(),
            }
        )

        return {
            "session": self.get_session(user_id, session_id),
            "trial": trial_data,
            "share_per_player": trial_result.share_per_player,
            "completed": completed,
        }


class RTGTutorialService:
    def __init__(self, db):
        self.db = db
        self.config = get_game_config()

    def _hydrate_legacy_balances(self, session_ref, session: dict[str, Any]) -> dict[str, Any]:
        if "current_balance" in session and "current_partner_balance" in session:
            return session

        rounds = sorted_docs(
            self.db.collection(RTG_TUTORIAL_TRIALS).where("session_id", "==", session["session_id"]).stream(),
            "trial_index",
        )
        current_balance = float(self.config.tutorial.endowment)
        current_partner_balance = float(self.config.tutorial.endowment)

        for round_data in rounds:
            current_balance = round(current_balance + round_data.get("amount_kept", 0))
            current_partner_balance = round(
                current_partner_balance
                - round_data.get("sender_investment", 0)
                + round_data.get("return_amount", 0)
            )

        session_ref.update(
            {
                "current_balance": current_balance,
                "current_partner_balance": current_partner_balance,
                "cumulative_payoff": current_balance,
                "updated_at": utcnow(),
            }
        )
        session["current_balance"] = current_balance
        session["current_partner_balance"] = current_partner_balance
        session["cumulative_payoff"] = current_balance
        return session

    def _current_prompt(self, session: dict[str, Any]) -> dict[str, Any] | None:
        if session["completed"]:
            return None

        trial_index = session["completed_trials_count"] + 1
        sender_investment = self.config.tutorial.sender_investment_schedule[trial_index - 1]
        amount_received = round(sender_investment * self.config.tutorial.multiplier, 2)
        return {
            "trial_index": trial_index,
            "sender_investment": sender_investment,
            "amount_received": amount_received,
            "multiplier": self.config.tutorial.multiplier,
            "max_return_amount": amount_received,
        }

    def start_session(self, user_id: str) -> dict[str, Any]:
        session_id = build_session_id("rtg_tutorial")
        session_data = {
            "session_id": session_id,
            "user_id": user_id,
            "config_version": self.config.version,
            "game_type": "rtg_tutorial",
            "completed_trials_count": 0,
            "cumulative_payoff": float(self.config.tutorial.endowment),
            "current_balance": float(self.config.tutorial.endowment),
            "current_partner_balance": float(self.config.tutorial.endowment),
            "completed": False,
            "tutorial_completed": False,
            "comprehension_check_passed": False,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }
        self.db.collection(RTG_TUTORIAL_SESSIONS).document(session_id).set(session_data)
        return self.get_session(user_id, session_id)

    def get_session(self, user_id: str, session_id: str) -> dict[str, Any]:
        session_ref = self.db.collection(RTG_TUTORIAL_SESSIONS).document(session_id)
        session = get_document_or_404(
            session_ref,
            "RTG tutorial session not found.",
        )
        if session["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="This session belongs to another user.")
        session = self._hydrate_legacy_balances(session_ref, session)

        return {
            "session_id": session["session_id"],
            "phase": "comprehension"
            if session["completed"] and not session["comprehension_check_passed"]
            else ("completed" if session["comprehension_check_passed"] else "trial"),
            "total_trials": self.config.tutorial.trials,
            "completed_trials_count": session["completed_trials_count"],
            "cumulative_payoff": session.get("cumulative_payoff", self.config.tutorial.endowment),
            "current_balance": session.get("current_balance", self.config.tutorial.endowment),
            "current_partner_balance": session.get("current_partner_balance", self.config.tutorial.endowment),
            "endowment": self.config.tutorial.endowment,
            "multiplier": self.config.tutorial.multiplier,
            "prompt": self._current_prompt(session),
            "tutorial_completed": session["tutorial_completed"],
            "comprehension_check_passed": session["comprehension_check_passed"],
        }

    def submit_trial(
        self,
        user_id: str,
        session_id: str,
        return_amount: float,
        response_time_ms: int,
    ) -> dict[str, Any]:
        session_ref = self.db.collection(RTG_TUTORIAL_SESSIONS).document(session_id)
        session = get_document_or_404(session_ref, "RTG tutorial session not found.")
        if session["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="This session belongs to another user.")
        if session["completed"]:
            raise HTTPException(status_code=400, detail="Tutorial session is already completed.")
        session = self._hydrate_legacy_balances(session_ref, session)

        prompt = self._current_prompt(session)
        if prompt is None:
            raise HTTPException(status_code=400, detail="No tutorial prompt is available.")

        return_amount = round(return_amount)

        if not 0 <= return_amount <= prompt["max_return_amount"]:
            raise HTTPException(status_code=400, detail="Return amount is out of range.")

        amount_kept = round(prompt["amount_received"] - return_amount)
        current_balance = round(session.get("current_balance", self.config.tutorial.endowment))
        current_partner_balance = round(session.get("current_partner_balance", self.config.tutorial.endowment))
        updated_balance = round(current_balance + amount_kept)
        updated_partner_balance = round(current_partner_balance - prompt["sender_investment"] + return_amount)
        trial_data = {
            "session_id": session_id,
            "user_id": user_id,
            "tutorial_trial_flag": True,
            "main_task_trial_flag": False,
            "trial_index": prompt["trial_index"],
            "endowment": self.config.tutorial.endowment,
            "sender_investment": prompt["sender_investment"],
            "multiplier": self.config.tutorial.multiplier,
            "amount_received": prompt["amount_received"],
            "return_amount": return_amount,
            "amount_kept": amount_kept,
            "participant_balance_after_trial": updated_balance,
            "partner_balance_after_trial": updated_partner_balance,
            "response_time_ms": response_time_ms,
            "created_at": utcnow(),
        }
        self.db.collection(RTG_TUTORIAL_TRIALS).add(trial_data)

        completed_trials_count = prompt["trial_index"]
        completed = completed_trials_count >= self.config.tutorial.trials
        session_ref.update(
            {
                "completed_trials_count": completed_trials_count,
                "cumulative_payoff": updated_balance,
                "current_balance": updated_balance,
                "current_partner_balance": updated_partner_balance,
                "completed": completed,
                "tutorial_completed": completed,
                "updated_at": utcnow(),
            }
        )

        return {
            "session": self.get_session(user_id, session_id),
            "trial": trial_data,
            "completed": completed,
        }

    def submit_comprehension(
        self,
        user_id: str,
        session_id: str,
        multiplier_answer: int,
        return_basis_answer: str,
        repeated_interaction_answer: bool,
    ) -> dict[str, Any]:
        session_ref = self.db.collection(RTG_TUTORIAL_SESSIONS).document(session_id)
        session = get_document_or_404(session_ref, "RTG tutorial session not found.")
        if session["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="This session belongs to another user.")
        if not session["tutorial_completed"]:
            raise HTTPException(status_code=400, detail="Tutorial must be completed first.")

        feedback = [
            {
                "question_key": "multiplier",
                "prompt": "보낸 돈은 몇 배가 되어 trustee에게 전달되나요?",
                "is_correct": multiplier_answer == 3,
                "correct_answer": "3배",
                "explanation": "본 과제에서는 trustor가 보낸 금액이 항상 3배가 되어 trustee에게 전달됩니다.",
            },
            {
                "question_key": "return_basis",
                "prompt": "trustee는 어떤 금액 범위 안에서 돌려줄 수 있나요?",
                "is_correct": return_basis_answer == "tripled_amount",
                "correct_answer": "3배가 된 뒤 받은 금액 안에서",
                "explanation": "trustee는 tripled amount 전체를 기준으로 얼마를 돌려줄지 결정합니다.",
            },
            {
                "question_key": "repeated_interaction",
                "prompt": "본실험에서는 같은 partner와 반복 상호작용하나요?",
                "is_correct": repeated_interaction_answer is True,
                "correct_answer": "예",
                "explanation": "RTG 본실험은 같은 partner와 15 trial씩 반복 상호작용하는 block 구조입니다.",
            },
        ]

        passed = all(item["is_correct"] for item in feedback)

        session_ref.update(
            {
                "comprehension_check_passed": passed,
                "comprehension_check_answers": {
                    "multiplier_answer": multiplier_answer,
                    "return_basis_answer": return_basis_answer,
                    "repeated_interaction_answer": repeated_interaction_answer,
                },
                "updated_at": utcnow(),
            }
        )

        return {
            "session": self.get_session(user_id, session_id),
            "passed": passed,
            "feedback": feedback,
        }

    def latest_passed_session(self, user_id: str) -> dict[str, Any] | None:
        docs = list(
            self.db.collection(RTG_TUTORIAL_SESSIONS)
            .where("user_id", "==", user_id)
            .stream()
        )
        candidates = [
            doc.to_dict()
            for doc in docs
            if doc.to_dict().get("tutorial_completed") and doc.to_dict().get("comprehension_check_passed")
        ]
        if not candidates:
            return None
        return sorted(candidates, key=lambda item: item.get("updated_at", utcnow()), reverse=True)[0]


class RTGSessionService:
    def __init__(self, db):
        self.db = db
        self.config = get_game_config()
        self.tutorial_service = RTGTutorialService(db)

    def _hydrate_legacy_balances(self, session_ref, session: dict[str, Any]) -> dict[str, Any]:
        if "current_balance" in session and "current_partner_balance" in session:
            return session

        rounds = sorted_docs(
            self.db.collection(RTG_TRIALS).where("session_id", "==", session["session_id"]).stream(),
            "rtg_trial_index",
        )
        last_round = rounds[-1] if rounds else None

        current_balance = (
            last_round.get("participant_balance_after_trial", last_round.get("participant_total_payoff_this_trial"))
            if last_round
            else float(self.config.rtg.endowment)
        )

        if last_round and last_round.get("rtg_block_index") == session.get("current_block_index"):
            current_partner_balance = float(self.config.rtg.endowment)
            current_block_rounds = [
                round_data for round_data in rounds if round_data.get("rtg_block_index") == session.get("current_block_index")
            ]
            for round_data in current_block_rounds:
                current_partner_balance = round_data.get(
                    "partner_balance_after_trial",
                    round(
                        current_partner_balance
                        + round_data.get("amount_received_by_partner", 0)
                        - round_data.get("partner_return_amount", 0)
                    ),
                )
        else:
            current_partner_balance = float(self.config.rtg.endowment)

        session_ref.update(
            {
                "current_balance": current_balance,
                "current_partner_balance": current_partner_balance,
                "cumulative_payoff": current_balance,
                "updated_at": utcnow(),
            }
        )
        session["current_balance"] = current_balance
        session["current_partner_balance"] = current_partner_balance
        session["cumulative_payoff"] = current_balance
        return session

    def _build_block_plan(self, session_id: str) -> list[dict[str, Any]]:
        partners = list(self.config.rtg.partners)
        if self.config.rtg.block_order == "randomized":
            random.shuffle(partners)

        labels = ["Partner A", "Partner B", "Partner C", "Partner D", "Partner E"]
        block_plan: list[dict[str, Any]] = []
        for index, partner in enumerate(partners, start=1):
            block_plan.append(
                {
                    "block_index": index,
                    "partner_id": f"{session_id}_partner_{index}",
                    "partner_type": partner.code,
                    "partner_name": partner.name,
                    "public_label": labels[index - 1],
                    "partner_seed": random.randint(1, 2_147_483_647),
                }
            )
        return block_plan

    def _get_partner_config(self, partner_code: int):
        for partner in self.config.rtg.partners:
            if partner.code == partner_code:
                return partner
        raise HTTPException(status_code=500, detail=f"Partner config not found for code {partner_code}.")

    def _session_payload(self, session: dict[str, Any]) -> dict[str, Any]:
        phase = "completed" if session["completed"] else session["status"]
        active_block = None
        if 1 <= session["current_block_index"] <= len(session["block_plan"]):
            active_block = session["block_plan"][session["current_block_index"] - 1]

        return {
            "session_id": session["session_id"],
            "phase": phase,
            "config_version": session["config_version"],
            "total_blocks": len(session["block_plan"]),
            "trials_per_block": self.config.rtg.trials_per_partner,
            "completed_trials_count": session["completed_trials_count"],
            "cumulative_payoff": session["cumulative_payoff"],
            "current_balance": session.get("current_balance", self.config.rtg.endowment),
            "current_partner_balance": session.get("current_partner_balance", self.config.rtg.endowment),
            "current_block_index": session["current_block_index"] if not session["completed"] else None,
            "current_trial_within_block": session["current_trial_within_block"] if session["status"] == "in_progress" else None,
            "overall_trial_index": None if session["completed"] else session["completed_trials_count"] + 1,
            "current_partner_label": active_block["public_label"] if active_block else None,
            "endowment": session.get("current_balance", self.config.rtg.endowment),
            "multiplier": self.config.rtg.multiplier,
            "awaiting_post_block": session["status"] == "awaiting_post_block",
            "block_plan": [
                {
                    "block_index": block["block_index"],
                    "partner_id": block["partner_id"],
                    "public_label": block["public_label"],
                }
                for block in session["block_plan"]
            ],
        }

    def start_session(self, user_id: str) -> dict[str, Any]:
        tutorial_session = self.tutorial_service.latest_passed_session(user_id)
        if tutorial_session is None:
            raise HTTPException(
                status_code=400,
                detail="RTG tutorial and comprehension check must be completed before the main task.",
            )

        session_id = build_session_id("rtg")
        session_data = {
            "session_id": session_id,
            "user_id": user_id,
            "config_version": self.config.version,
            "game_type": "rtg_main",
            "tutorial_session_id": tutorial_session["session_id"],
            "block_plan": self._build_block_plan(session_id),
            "current_block_index": 1,
            "current_trial_within_block": 1,
            "completed_trials_count": 0,
            "cumulative_payoff": float(self.config.rtg.endowment),
            "current_balance": float(self.config.rtg.endowment),
            "current_partner_balance": float(self.config.rtg.endowment),
            "status": "in_progress",
            "completed": False,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }
        self.db.collection(RTG_SESSIONS).document(session_id).set(session_data)
        return self.get_session(user_id, session_id)

    def get_session(self, user_id: str, session_id: str) -> dict[str, Any]:
        session_ref = self.db.collection(RTG_SESSIONS).document(session_id)
        session = get_document_or_404(session_ref, "RTG session not found.")
        if session["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="This session belongs to another user.")
        session = self._hydrate_legacy_balances(session_ref, session)
        return self._session_payload(session)

    def submit_trial(
        self,
        user_id: str,
        session_id: str,
        amount_sent: float,
        response_time_ms: int,
    ) -> dict[str, Any]:
        session_ref = self.db.collection(RTG_SESSIONS).document(session_id)
        session = get_document_or_404(session_ref, "RTG session not found.")
        if session["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="This session belongs to another user.")
        session = self._hydrate_legacy_balances(session_ref, session)
        if session["completed"] or session["status"] != "in_progress":
            raise HTTPException(status_code=400, detail="RTG session is not ready for a trial submission.")

        amount_sent = round(amount_sent)
        available_balance = round(session.get("current_balance", self.config.rtg.endowment))
        if not 0 <= amount_sent <= available_balance:
            raise HTTPException(status_code=400, detail="Sent amount must stay within the currently available balance.")

        block = session["block_plan"][session["current_block_index"] - 1]
        partner_config = self._get_partner_config(block["partner_type"])
        trial_within_partner = session["current_trial_within_block"]
        rtg_trial_index = session["completed_trials_count"] + 1
        amount_kept = round(available_balance - amount_sent)
        amount_received_by_partner = round(amount_sent * self.config.rtg.multiplier)
        current_partner_balance = round(session.get("current_partner_balance", self.config.rtg.endowment))

        partner_engine = PartnerEngine(partner_config, block["partner_seed"])
        partner_response = partner_engine.generate_return(
            amount_received_by_partner,
            trial_within_partner,
        )
        participant_total_payoff_this_trial = round(amount_kept + partner_response.return_amount)
        updated_partner_balance = round(
            current_partner_balance + amount_received_by_partner - partner_response.return_amount
        )
        cumulative_payoff = participant_total_payoff_this_trial

        trial_data = {
            "session_id": session_id,
            "user_id": user_id,
            "tutorial_trial_flag": False,
            "main_task_trial_flag": True,
            "missing_response_flag": False,
            "timeout_flag": False,
            "rtg_trial_index": rtg_trial_index,
            "rtg_block_index": block["block_index"],
            "partner_id": block["partner_id"],
            "partner_type": block["partner_type"],
            "partner_public_label": block["public_label"],
            "trial_within_partner": trial_within_partner,
            "endowment": available_balance,
            "amount_sent": amount_sent,
            "amount_kept": amount_kept,
            "multiplier": self.config.rtg.multiplier,
            "amount_received_by_partner": amount_received_by_partner,
            "partner_return_amount": partner_response.return_amount,
            "partner_return_ratio": partner_response.return_ratio,
            "participant_total_payoff_this_trial": participant_total_payoff_this_trial,
            "cumulative_payoff": cumulative_payoff,
            "participant_balance_after_trial": participant_total_payoff_this_trial,
            "partner_balance_after_trial": updated_partner_balance,
            "response_time_ms": response_time_ms,
            "algorithm_version": partner_response.algorithm_log["algorithm_version"],
            "partner_seed": block["partner_seed"],
            "contingency_schedule_id": partner_response.algorithm_log["contingency_schedule_id"],
            "created_at": utcnow(),
        }
        self.db.collection(RTG_TRIALS).add(trial_data)

        completed_trials_count = rtg_trial_index
        block_complete = trial_within_partner >= self.config.rtg.trials_per_partner
        completed = completed_trials_count >= len(session["block_plan"]) * self.config.rtg.trials_per_partner

        updates: dict[str, Any] = {
            "completed_trials_count": completed_trials_count,
            "cumulative_payoff": cumulative_payoff,
            "current_balance": participant_total_payoff_this_trial,
            "current_partner_balance": updated_partner_balance,
            "updated_at": utcnow(),
        }

        if completed:
            updates.update(
                {
                    "completed": True,
                    "status": "completed",
                }
            )
        elif block_complete:
            updates.update({"status": "awaiting_post_block"})
        else:
            updates.update({"current_trial_within_block": trial_within_partner + 1})

        session_ref.update(updates)

        return {
            "session": self.get_session(user_id, session_id),
            "trial": trial_data,
            "block_complete": block_complete,
            "completed": completed,
        }

    def submit_post_block(
        self,
        user_id: str,
        session_id: str,
        partner_classification_response: str,
        classification_confidence: int,
        willingness_to_play_again: int,
    ) -> dict[str, Any]:
        session_ref = self.db.collection(RTG_SESSIONS).document(session_id)
        session = get_document_or_404(session_ref, "RTG session not found.")
        if session["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="This session belongs to another user.")
        session = self._hydrate_legacy_balances(session_ref, session)
        if session["status"] != "awaiting_post_block":
            raise HTTPException(status_code=400, detail="This session is not waiting for a post-block response.")

        if partner_classification_response not in self.config.post_block_questions.partner_classification_options:
            raise HTTPException(status_code=400, detail="Invalid partner classification response.")
        if not 1 <= classification_confidence <= 7:
            raise HTTPException(status_code=400, detail="classification_confidence must be within [1, 7].")
        if not 1 <= willingness_to_play_again <= 7:
            raise HTTPException(status_code=400, detail="willingness_to_play_again must be within [1, 7].")

        block = session["block_plan"][session["current_block_index"] - 1]
        correct_answer = PARTNER_CLASSIFICATION_MAP[block["partner_type"]]
        post_block_data = {
            "session_id": session_id,
            "user_id": user_id,
            "rtg_block_index": block["block_index"],
            "partner_id": block["partner_id"],
            "partner_type": block["partner_type"],
            "partner_public_label": block["public_label"],
            "partner_classification_response": partner_classification_response,
            "partner_classification_correct": partner_classification_response == correct_answer,
            "classification_confidence": classification_confidence,
            "willingness_to_play_again": willingness_to_play_again,
            "created_at": utcnow(),
        }
        self.db.collection(RTG_POST_BLOCKS).add(post_block_data)

        final_block = session["current_block_index"] >= len(session["block_plan"])
        updates: dict[str, Any]
        if final_block:
            updates = {
                "completed": True,
                "status": "completed",
                "updated_at": utcnow(),
            }
        else:
            updates = {
                "status": "in_progress",
                "current_block_index": session["current_block_index"] + 1,
                "current_trial_within_block": 1,
                "current_partner_balance": float(self.config.rtg.endowment),
                "updated_at": utcnow(),
            }

        session_ref.update(updates)
        return {
            "session": self.get_session(user_id, session_id),
            "post_block": post_block_data,
            "completed": final_block,
        }


def latest_completed_session(db, collection_name: str, user_id: str) -> dict[str, Any] | None:
    docs = list(db.collection(collection_name).where("user_id", "==", user_id).stream())
    completed_docs = [doc.to_dict() for doc in docs if doc.to_dict().get("completed")]
    if not completed_docs:
        return None
    return sorted(completed_docs, key=lambda item: item.get("updated_at", utcnow()), reverse=True)[0]
