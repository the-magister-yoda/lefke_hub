import os
import anyio

from uuid import  uuid4
from sqlalchemy import select, func, and_, exists, desc, asc, false
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.exc import IntegrityError

from app.utils.image_processing import process_and_save_image
from app.models import Ad, AdImage, Status, Category, Favorite
from app.errors import AdsNotFound, DbError, EmptyRequest, CategoryNotFound


UPLOAD_DIR = "uploads/ads"


async def service_create_ad(ad, images, user, db):
    # 1. Проверка категории
    query = select(Category).where(Category.slug == ad.category_slug)
    result = await db.execute(query)
    db_category = result.scalars().first()

    if not db_category:
        raise CategoryNotFound()
    
    # 2. Создание объекта объявления
    db_add = Ad(
        title=ad.title, 
        description=ad.description,
        price=ad.price, 
        category_id=db_category.id,
        owner_id=user.id
    )
    db.add(db_add)

    try:
        # Получаем ID объявления, не завершая транзакцию
        await db.flush()

        if images:
            folder_path = f"{UPLOAD_DIR}/{db_add.id}"
            await anyio.to_thread.run_sync(os.makedirs, folder_path, 0o777, True)

            for order, file in enumerate(images, start=1):
                filename = f"{uuid4()}.webp"
                
                relative_path = f"{db_add.id}/{filename}"
                full_path = f"{UPLOAD_DIR}/{relative_path}"

                await process_and_save_image(file, full_path)

                db_image = AdImage(
                    ad_id=db_add.id,
                    url=full_path, # путь будет идти вместе с названием папки
                    order=order
                )
                db.add(db_image)

                if order == 1:
                    db_add.main_image = full_path

        await db.commit()
        
        # 3. Подгружаем связанные данные для Pydantic
        query_final = (
            select(Ad)
            .where(Ad.id == db_add.id)
            .options(selectinload(Ad.category), selectinload(Ad.images))
        )
        refresh_result = await db.execute(query_final)
        return refresh_result.scalar_one()

    except IntegrityError:
        await db.rollback()
        raise DbError()


async def service_get_ads(skip: int, limit: int, ad, user, db):
    user_condition = Favorite.user_id == user.id if user else false()

    # Создаем подзапрос EXISTS для колонки is_favorite для join
    is_favorite_query = exists(
        select(Favorite.ad_id)
        .where(and_(Favorite.ad_id == Ad.id, user_condition))
    ).label("is_favorite")

    query = (
        select(Ad, is_favorite_query)
        .options(
            selectinload(Ad.category),
            selectinload(Ad.images)
        )
        .where(Ad.status == Status.ACTIVE)
    )

    if ad.category:
        query = query.join(Category).where(Category.slug == ad.category)

    if ad.min_price is not None:
        query = query.where(Ad.price >= ad.min_price)

    if ad.max_price is not None:
        query = query.where(Ad.price <= ad.max_price)

    if ad.search:
        query = query.where(Ad.title.ilike(f"%{ad.search}%"))

    # Нужно будет оптимизировать этот участок т.к он забирает отдельный await и нагружает бд и время ф-ии
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    sort_map = {
        "date_desc": desc(Ad.created_at),
        "date_asc": asc(Ad.created_at),
        "price_desc": desc(Ad.price),
        "price_asc": asc(Ad.price),
        "views_desc": desc(Ad.views),
        "views_asc": asc(Ad.views),
    }
    
    if ad.sort_by in sort_map:
        query = query.order_by(sort_map[ad.sort_by])
    else:
        query = query.order_by(desc(Ad.created_at))

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)

    rows = result.unique().all()

    # Маппим рез-ты
    items = []
    for row in rows:
        # row — это кортеж (Ad, bool), так как в select у нас (Ad, is_favorite_query)
        ad_obj = row[0] 
        is_fav = row[1]
        
        # Динамически вешаем признак избранного
        ad_obj.is_favorite = is_fav
        items.append(ad_obj)

    return {"total": total, "items": items}


async def service_get_ad(ad_id, user, db):
    query = (
        select(Ad)
        .where(
            (Ad.id == ad_id) &
            (Ad.status == Status.ACTIVE)
        )
        .options(
            selectinload(Ad.category),
            selectinload(Ad.images),
            selectinload(Ad.user)
        )
    )

    result = await db.execute(query)
    db_ad = result.scalars().first()

    if not db_ad:
        raise AdsNotFound()

    if user and user.id != db_ad.owner_id:
        db_ad.views += 1

    await db.commit() # Этот коммит добавляет изменения кол-во просмотров
    await db.refresh(db_ad)

    return db_ad


async def service_get_my_ads(current_user, db):
    query = (
        select(Ad)
        .options(
            joinedload(Ad.category)
        )
        .where(
            (Ad.owner_id == current_user.id) &
            (Ad.status == Status.ACTIVE)
        )
    ).order_by(desc(Ad.created_at))

    result = await db.execute(query)

    ads = result.scalars().all()

    if not ads:
        raise AdsNotFound()

    return ads


async def service_get_my_archived_ads(user, db):
    query = (
        select(Ad)
        .options(
            joinedload(Ad.category)
        )
        .where(
            (Ad.owner_id == user.id),
            (Ad.status == Status.ARCHIVED)
        )
    ).order_by(desc(Ad.created_at))

    result = await db.execute(query)
    ads = result.scalars().all()

    return ads


async def service_update_ad(ad_id, ad, user, db):
    query = ( 
        select(Ad)
        .options(joinedload(Ad.category))
        .where(
            (Ad.id == ad_id) &
            (Ad.owner_id == user.id) &
            (Ad.status == Status.ACTIVE)
        )
    )

    result = await db.execute(query)
    db_ad = result.scalars().first()

    if not db_ad:
        raise AdsNotFound()

    if ad.title is None and ad.description is None and ad.price is None and ad.category_id is None:
        raise EmptyRequest()

    if ad.title is not None:
        db_ad.title = ad.title

    if ad.description is not None:
        db_ad.description = ad.description

    if ad.price is not None:
        db_ad.price = ad.price

    if ad.category_id is not None:
        db_ad.category_id = ad.category_id

    try:
        await db.commit()
        
    except IntegrityError:
        await db.rollback()

    await db.refresh(db_ad)

    return db_ad


async def service_delete_ad(ad_id, user, db):
    query = (
        select(Ad)
        .where(
            (Ad.id == ad_id) &
            (Ad.owner_id == user.id) &
            (Ad.status == Status.ACTIVE)
        )
    )

    result = await db.execute(query)
    db_ad = result.scalars().first()

    if not db_ad:
        raise AdsNotFound()

    db_ad.status = Status.ARCHIVED

    await db.commit()
    await db.refresh(db_ad)

    return db_ad


async def service_restore_ad(ad_id, user, db):
    query = (
        select(Ad)
        .where(
            (Ad.id == ad_id) &
            (Ad.owner_id == user.id) &
            (Ad.status == Status.ARCHIVED)            
        )
    )
   
    result = await db.execute(query)
    db_ad = result.scalars().first()

    if not db_ad:
        raise AdsNotFound()

    db_ad.status = Status.ACTIVE

    await db.commit()
    await db.refresh(db_ad)

    return db_ad

    