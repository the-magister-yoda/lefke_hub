from pydantic import BaseModel
from datetime import datetime

from app.models import UserRole


class UserCreate(Basemodel):
    username: str
    email: str
    phone_number: str
    password: str


class UserResponse(BaseModel):
    username: str
    email: str
    role: UserRole
    created_at: datetime



