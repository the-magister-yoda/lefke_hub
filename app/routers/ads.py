import json

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from functools import wraps
from typing import List, Optional
from decimal import Decimal

from app.models import Ad, User
from app.database import get_db
from app.errors import AdsNotFound, DbError, EmptyRequest, CategoryNotFound
from app.core.dependencies import get_current_user, get_possible_user
from app.schemas.ad_schemas import AdCreate, AdResponse, AdFullResponse, AdListResponse
from app.schemas.ad_schemas import AdUpdate, AdFilterSchema, SearchRequest
from app.services.ad_service import service_create_ad, service_update_ad, service_delete_ad, service_restore_ad
from app.services.ad_service import service_get_ads, service_get_ad, service_get_my_ads, service_get_my_archived_ads
from app.services.ad_service import service_search_ads


router = APIRouter()


def handle_ads_errors(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)

        except AdsNotFound:
            raise HTTPException(status_code=404, detail='There no ad(s) currently please add one to watch.')

        except CategoryNotFound:
            raise HTTPException(status=400, detail='Please enter valid category name.')

        except EmptyRequest:
            raise HTTPException(status_code=404, detail="Empty request please put some data in.")

        except DbError:
            raise HTTPException(status_code=500, detail="Database Error please try later.")

    return wrapper


@router.post("/create")
@handle_ads_errors
async def create_ad(
    title: str = Form(...),
    description: str = Form(...),
    price: Decimal = Form(...),
    category_slug: str = Form(...),
    embedding: str = Form(None),
    images: List[UploadFile] = File(None),
    user = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):

    ad = AdCreate(
        title=title,
        description=description,
        price=price,
        category_slug=category_slug,
        embedding=embedding
    )

    return await service_create_ad(ad, images, user, db)


@router.post("/search", response_model=List[AdResponse])
async def search_ads(data: SearchRequest, db: AsyncSession = Depends(get_db)):
    return await service_search_ads(data, db)


@router.get("/", response_model=AdListResponse)
@handle_ads_errors
async def get_ads(skip: int = 0, limit: int = 10, 
    ad: AdFilterSchema = Depends(), user: User = Depends(get_possible_user), 
    db: AsyncSession = Depends(get_db)):

    return await service_get_ads(skip, limit, ad, user, db)


@router.get("/my", response_model=List[AdResponse])
@handle_ads_errors
async def get_my_ads(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await service_get_my_ads(current_user, db)


@router.get("/my/archived", response_model=List[AdResponse])
@handle_ads_errors
async def get_my_archived_ads(user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await service_get_my_archived_ads(user, db)


@router.get("/{ad_id}", response_model=AdFullResponse)
@handle_ads_errors
async def get_ad(ad_id: int, user: Optional[User] = Depends(get_possible_user), db: AsyncSession = Depends(get_db)):
    return await service_get_ad(ad_id, user, db)


@router.patch("/{ad_id}", response_model=AdResponse)
@handle_ads_errors
async def update_ad(ad_id: int, ad: AdUpdate, user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await service_update_ad(ad_id, ad, user, db)


@router.delete("/{ad_id}", response_model=AdResponse)
@handle_ads_errors
async def delete_ad(ad_id: int, user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await service_delete_ad(ad_id, user, db)


@router.patch("/restore/{ad_id}", response_model=AdResponse)
@handle_ads_errors
async def restore_ad(ad_id: int, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await service_restore_ad(ad_id, user, db) 


# # Специальный endpoint по которому парсер включая нейронку будет отправлять запрос
# @router.post("/bot/create")
# @handle_ads_errors
# async def create_bot_ad(
#     title: str = Form(...),
#     description: str = Form(...),
#     price: Decimal = Form(...),
#     category_slug: str = Form(...),
#     images = List[UploadFile] = File(None),
#     user: User = Depends(get_current_user), 
#     db: AsyncSession = Depends(get_db)
# ):

#     ad = AdCreate(
#         title=title,
#         description=description,
#         price=price,
#         category_slug=category_slug

#     )

#     return await service_create_bot_ad(ad, images, user, db)