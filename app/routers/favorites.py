from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from functools import wraps
from typing import List

from app.models import User
from app.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.favorite_schemas import FavoriteResponse
from app.services.favorite_service import service_get_favorites, service_toggle_favorite


router = APIRouter()


def handle_favorite_errors(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)

        except AdsNotFound:
            raise HTTPException(status_code=404, detail='There no ad(s) currently please add one to watch.')

        except DbError:
            raise HTTPException(status_code=500, detail="Database Error please try later.")

    return wrapper


@router.get("/", response_model=List[FavoriteResponse])
@handle_favorite_errors
async def get_favorites(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await service_get_favorites(current_user, db)


@router.post("/{ad_id}")
@handle_favorite_errors
async def toggle_favorite(ad_id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await service_toggle_favorite(ad_id, user, db)
