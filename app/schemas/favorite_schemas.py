from pydantic import BaseModel
from datetime import datetime

from app.schemas.ad_schemas import AdResponse

class FavoriteResponse(BaseModel):
    ad: AdResponse 
    added_at: datetime

    class Config:
        from_attributes = True