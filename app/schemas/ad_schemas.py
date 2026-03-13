from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from typing import List, Optional

from app.schemas.category_schemas import CategoryResponse
from app.models import Status, Ad


class AdCreate(BaseModel):
    title: str
    description: str
    price: Decimal
    category_id: int


class AdImageResponse(BaseModel):
    url: str

    class Config:
        from_attributes = True


class AdResponse(BaseModel):
    id: int
    title: str
    price: Decimal
    category: CategoryResponse
    images: List[AdImageResponse]
    created_at: datetime
    views: int

    class Config:
        from_attributes = True




class AdFullResponse(BaseModel):
    id: int
    title: str
    description: str
    price: Decimal
    category: CategoryResponse
    images: List[AdImageResponse]
    views: int
    status: Status
    created_at: datetime

    class Config:
        from_attributes = True


class AdUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    category_id: Optional[int] = None


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
