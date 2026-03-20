from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
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
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)

        except AdsNotFound:
            raise HTTPException(status_code=404, detail='There no ad(s) currently please add one to watch.')

        except DbError:
            raise HTTPException(status_code=500, detail="Database Error please try later.")

    return wrapper


@router.get("/", response_model=List[FavoriteResponse])
@handle_favorite_errors
def get_favorites(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_get_favorites(current_user, db)


@router.post("/{ad_id}")
@handle_favorite_errors
def toggle_favorite(ad_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_toggle_favorite(ad_id, user, db)
