from typing import Literal

from pydantic import BaseModel, Field


class SessionState(BaseModel):
    session_id: str
    phase: str
    config_version: str | None = None
    total_trials: int | None = None
    total_blocks: int | None = None
    trials_per_block: int | None = None
    completed_trials_count: int = 0
    cumulative_payoff: float | None = None
    current_balance: float | None = None
    current_partner_balance: float | None = None
    current_trial_index: int | None = None
    current_block_index: int | None = None
    current_trial_within_block: int | None = None
    overall_trial_index: int | None = None
    current_partner_label: str | None = None
    endowment: float | None = None
    multiplier: float | None = None
    group_size: int | None = None
    awaiting_post_block: bool | None = None
    tutorial_completed: bool | None = None
    comprehension_check_passed: bool | None = None
    prompt: dict | None = None
    block_plan: list[dict] | None = None


class SessionStartResponse(BaseModel):
    session: SessionState


class SessionStartRequest(BaseModel):
    replace_completed: bool = False


class PublicGoodsSubmitTrialRequest(BaseModel):
    session_id: str
    contribution: float = Field(ge=0)
    response_time_ms: int = Field(ge=0)


class PublicGoodsSubmitTrialResponse(BaseModel):
    session: SessionState
    trial: dict
    share_per_player: float
    completed: bool


class RTGTutorialSubmitTrialRequest(BaseModel):
    session_id: str
    return_amount: int = Field(ge=0)
    response_time_ms: int = Field(ge=0)


class RTGTutorialSubmitTrialResponse(BaseModel):
    session: SessionState
    trial: dict
    completed: bool


class RTGTutorialComprehensionRequest(BaseModel):
    session_id: str
    multiplier_answer: int
    return_basis_answer: Literal["tripled_amount", "original_amount", "fixed_bonus"]
    repeated_interaction_answer: bool


class RTGTutorialComprehensionResponse(BaseModel):
    session: SessionState
    passed: bool
    feedback: list[dict]


class RTGSubmitTrialRequest(BaseModel):
    session_id: str
    amount_sent: int = Field(ge=0)
    response_time_ms: int = Field(ge=0)


class RTGSubmitTrialResponse(BaseModel):
    session: SessionState
    trial: dict
    block_complete: bool
    completed: bool


class RTGPostBlockRequest(BaseModel):
    session_id: str
    partner_classification_response: Literal["high_return", "low_return", "unpredictable"]
    classification_confidence: int = Field(ge=1, le=7)
    willingness_to_play_again: int = Field(ge=1, le=7)


class RTGPostBlockResponse(BaseModel):
    session: SessionState
    post_block: dict
    completed: bool
