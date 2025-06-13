from pydantic import BaseModel
from typing import Optional


class MatchRequest(BaseModel):
    user_id: str
    game_type: str  # e.g., 'trust-game'
    personality: Optional[str] = None


class MatchResult(BaseModel):
    user_id: str
    matched_personality: str
    match_id: str
    timestamp: Optional[str] = None
    description: Optional[str] = None
