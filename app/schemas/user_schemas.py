from pydantic import BaseModel
from datetime import datetime

from app.models import UserRole


class UserCreate(BaseModel):
    username: str
    email: str
    phone_number: str
    password: str


class UserResponse(BaseModel):
    username: str
    email: str
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    # Здесь не нужно исп-ть класс config from_attributes = True.
    # Он используется, когда возвращаешь ORM объект.
    # Здесь ты возвращаешь обычный dict.