from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import Optional

from app.models import Status


class AdCreate(BaseModel):
    title: str
    description: str
    price: str
    category: str


class AdResponse(BaseModel):
    title: str
    price: Decimal
    created_at: datetime

    class Config:
        from_attributes = True


class AdFullResponse(BaseModel):
    title: str
    description: str
    price: Decimal
    category: str
    created_at: datetime
    status: Status

    class Config:
        from_attributes = True


class AdUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    category: Optional[str] = None





