from pydantic import BaseModel
from typing import Optional, List


class PublicGoodsGameRound(BaseModel):
    user_id: str
    round: int
    donation: int
    payoff: float
    balance: float


class TrustGameRound(BaseModel):
    user_id: str
    round: int
    role: str  # 'trustor' or 'trustee'
    investment: Optional[int] = None
    returned: Optional[int] = None
    payoff: float
    balance: float


class PublicGoodsGameRequest(BaseModel):
    round: int
    donation: int
    current_balance: float


class TrustGameRequest(BaseModel):
    round: int
    role: str  # 'trustor' or 'trustee'
    current_balance: float
    # For trustee (받아서 돌려주는 사람)
    received_amount: Optional[int] = None
    return_amount: Optional[int] = None
    # For trustor (투자하는 사람)
    investment: Optional[int] = None


class GameResult(BaseModel):
    success: bool
    payoff: float
    new_balance: float
    message: str
    # Public Goods Game 상세 정보
    user_donation: Optional[int] = None
    other_donations: Optional[List[int]] = None
    total_donated: Optional[int] = None
    common_pot: Optional[float] = None
    share_per_player: Optional[float] = None
