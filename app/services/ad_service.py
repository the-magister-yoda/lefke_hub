import os

from uuid import  uuid4
from sqlalchemy import desc, asc, exists, and_, false
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import IntegrityError

from app.models import Ad, AdImage, Status, Category, Favorite
from app.errors import AdsNotFound, DbError, EmptyRequest, CategoryNotFound


UPLOAD_DIR = "uploads/ads"


def service_create_ad(ad, images, user, db):
    db_category = db.query(Category).filter(Category.slug == ad.category_slug).first()

    if not db_category:
        raise CategoryNotFound()
    
    db_add = Ad(
        title=ad.title, description=ad.description,
        price=ad.price, category_id=db_category.id,
        owner_id=user.id
    )

    db.add(db_add)
    try:
        db.commit()
    
    except IntegrityError:
        db.rollback()
        raise DbError()

    db.refresh(db_add)

    if images:

        os.makedirs(f"{UPLOAD_DIR}/{db_add.id}", exist_ok=True)

        order = 1

        for file in images:
            
            # Распарсивает любой формат файла чтобы не добавлять только jpg.
            # Нужно будет сделать список с допустимым разрешениями перед прод а то вдруг вирус загрузим ахахаха.
            ext = file.filename.split(".")[-1]
            filename = f"{uuid4()}.{ext}"
            filepath = f"{UPLOAD_DIR}/{db_add.id}/{filename}"

            # сохраняем файл
            with open(filepath, "wb") as fd:
                fd.write(file.file.read())

            db_image = AdImage(
                ad_id=db_add.id,
                url=filepath,
                order=order
            )

            db.add(db_image)

            if order == 1:
                db_add.main_image = filepath

            order += 1

        db.commit()

    return db_add


def service_get_ads(skip: int, limit: int, ad, user, db):
    user_condition = Favorite.user_id == user.id if user else false()

    # Создаем подзапрос EXISTS для колонки is_favorite для join
    is_favorite_query = exists(
        Favorite.ad_id
    ).select_from(Favorite).where(
        and_(
            Favorite.ad_id == Ad.id,
            user_condition
        )
    ).label("is_favorite")

    query = db.query(Ad, is_favorite_query).filter(Ad.status == Status.ACTIVE)

    if ad.category:
        query = query.join(Category).filter(Category.slug == ad.category)

    if ad.min_price is not None:
        query = query.filter(Ad.price >= ad.min_price)

    if ad.max_price is not None:
        query = query.filter(Ad.price <= ad.max_price)

    if ad.search:
        query = query.filter(Ad.title.ilike(f"%{ad.search}%"))

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

    total = query.count()
    results = query.offset(skip).limit(limit).all()

    # Маппим рез-ты
    items = []
    for ad_obj, is_fav in results:
        # SQLAlchemy объекты позволяют добавлять динамические атрибуты
        ad_obj.is_favorite = is_fav
        items.append(ad_obj)

    return {"total": total, "items": items}


def service_get_ad(ad_id, user, db):
    db_ad = db.query(Ad).options(joinedload(Ad.user)).filter(
        (Ad.id == ad_id) &
        (Ad.status == Status.ACTIVE)
    ).first()

    if not db_ad:
        raise AdsNotFound()

    if user and user.id != db_ad.owner_id:
        db_ad.views += 1

    db.commit()

    return db_ad


def service_get_my_ads(current_user, db):
    query = db.query(Ad).filter(
        (Ad.owner_id == current_user.id) &
        (Ad.status == Status.ACTIVE)
    )

    query = query.order_by(desc(Ad.created_at))
    ads = query.all()

    if not ads:
        raise AdsNotFound()

    return ads


def service_get_my_archived_ads(user, db):
    ads = db.query(Ad).filter(
        (Ad.owner_id == user.id) &
        (Ad.status == Status.ARCHIVED)
    ).all()

    if not ads:
        raise AdsNotFound()

    return ads


def service_update_ad(ad_id, ad, user, db):
    db_ad = db.query(Ad).filter(
        (Ad.id == ad_id) &
        (Ad.owner_id == user.id) &
        (Ad.status == Status.ACTIVE)
    ).first()

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

    db.commit()
    db.refresh(db_ad)

    return db_ad


def service_delete_ad(ad_id, user, db):
    db_ad = db.query(Ad).filter(
        (Ad.id == ad_id) &
        (Ad.owner_id == user.id) &
        (Ad.status == Status.ACTIVE)
    ).first()

    if not db_ad:
        raise AdsNotFound()

    db_ad.status = Status.ARCHIVED

    db.commit()
    db.refresh(db_ad)

    return db_ad


def service_restore_ad(ad_id, user, db):
    db_ad = db.query(Ad).filter(
        (Ad.id == ad_id) &
        (Ad.owner_id == user.id) &
        (Ad.status == Status.ARCHIVED)
    ).first()

    if not db_ad:
        raise AdsNotFound()

    db_ad.status = Status.ACTIVE

    db.commit()
    db.refresh(db_ad)

    return db_ad
    