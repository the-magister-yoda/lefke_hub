from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from functools import wraps
from typing import List

from app.models import Ad
from app.database import get_db
from app.errors import AdsNotFound, DbError, EmptyRequest
from app.core.dependencies import get_current_user
from app.schemas.ad_schemas import AdCreate, AdResponse, AdFullResponse, AdUpdate, AdFilterSchema, AdListResponse
from app.services.ad_service import service_get_ads, service_create_ad, service_get_my_ads, service_update_ad, service_delete_ad


router = APIRouter()


def handle_ads_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)

        except AdsNotFound:
            raise HTTPException(status_code=404, detail='There no ad(s) currently please add one to watch.')

        except EmptyRequest:
            raise HTTPException(status_code=404, detail="Empty request please put some data in.")

        except DbError:
            raise HTTPException(status_code=500, detail="Database Error please try later.")

    return wrapper


@router.get("/", response_model=AdListResponse)
@handle_ads_errors
def get_ads(skip: int = 0, limit: int = 10, ad: AdFilterSchema = Depends(), db: Session = Depends(get_db)):
    return service_get_ads(skip, limit, ad, db)


@router.post("/create", response_model=AdResponse)
@handle_ads_errors
def create_ad(ad: AdCreate, user = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_create_ad(ad, user, db)


@router.get("/my", response_model=List[AdFullResponse])
@handle_ads_errors
def get_my_ads(user = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_get_my_ads(user, db)


@router.patch("/update/{ad_id}", response_model=AdFullResponse)
@handle_ads_errors
def update_ad(ad_id: int, ad: AdUpdate, user = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_update_ad(ad_id, ad, user, db)


@router.delete("/delete/{ad_id}", response_model=AdFullResponse)
@handle_ads_errors
def delete_ad(ad_id: int, user = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_delete_ad(ad_id, user, db)


