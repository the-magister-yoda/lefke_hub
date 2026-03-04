from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

from app.models import UserRole, Status


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


class UserFullResponse(BaseModel):
    id: int
    username: str
    email: str
    phone_number: str
    role: UserRole
    created_at: datetime
    status: Status

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    username: str
    password: str


class UserListResponse(BaseModel):
    total: int
    items: List[UserResponse]

    class Config:
        from_attributes = True


class UserFilterSchema(BaseModel):
    only_active: Optional[str] = None
    search: Optional[str] = None
    sort_by: Optional[str] = None




class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    # Здесь не нужно исп-ть класс config from_attributes = True.
    # Он используется, когда возвращаешь ORM объект.
    # Здесь ты возвращаешь обычный dict.