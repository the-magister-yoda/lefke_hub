from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import List, Optional

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
    views: int

    class Config:
        from_attributes = True


class AdFullResponse(BaseModel):
    title: str
    description: str
    price: Decimal
    category: str
    created_at: datetime
    status: Status
    views: int

    class Config:
        from_attributes = True


class AdUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    category: Optional[str] = None


class AdFilterSchema(BaseModel):
    category: Optional[str] = None
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    search: Optional[str] = None
    sort_by: Optional[str] = None


class AdListResponse(BaseModel):
    total: int
    items: List[AdResponse]

    class Config:
        from_attributes = True





