from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    id: str
    username: Optional[str] = None
    email: Optional[str] = None
    created_at: Optional[str] = None
