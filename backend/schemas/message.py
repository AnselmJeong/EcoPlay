from pydantic import BaseModel
from typing import Optional, Dict, Any


class LLMMessage(BaseModel):
    user_id: str
    content: str
    role: str  # 'user' or 'assistant'
    timestamp: Optional[str] = None


class MessageRequest(BaseModel):
    game_type: str  # 'public_goods', 'trust_game_receiver', 'trust_game_trustee'
    round: int
    performance_data: Optional[Dict[str, Any]] = None


class MessageResponse(BaseModel):
    content: str
    role: str
    timestamp: str
