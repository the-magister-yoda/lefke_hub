from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from functools import wraps
from typing import List

from app.schemas.category_schemas import CategoryCreate, CategoryResponse
from app.services.category_service import service_create_category, service_get_categories, service_delete_category
from app.core.dependencies import get_current_user
from app.errors import CategoryNotFound, DbError, NotRights
from app.models import User
from app.database import get_db


router = APIRouter()


def handle_category_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)

        except CategoryNotFound:
            raise HTTPException(status_code=404, detail="Categories not found, add one to continue.")

        except NotRights:
            raise HTTPException(status_code=400, detail="Not enough right for this operation.")

        except DbError:
            raise HTTPException(status_code=500, detail="Database Error please try later.")

    return wrapper


@router.post("/", response_model=CategoryResponse)
@handle_category_errors
def create_category(category_data: CategoryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_create_category(category_data, current_user, db)


@router.get("/", response_model=List[CategoryResponse])
@handle_category_errors
def get_categories(db: Session = Depends(get_db)):
    return service_get_categories(db)


@router.delete("/{slug}")
@handle_category_errors
def delete_categoris(slug: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_delete_category(slug, current_user, db)