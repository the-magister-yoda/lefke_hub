from sqlalchemy import desc, asc
from sqlalchemy.exc import IntegrityError

from app.models import Ad, Status
from app.errors import AdsNotFound, DbError, EmptyRequest


def service_create_ad(ad, user, db):
    db_add = Ad(
        title=ad.title, description=ad.description,
        price=ad.price, category=ad.category,
        owner_id=user.id
    )
    db.add(db_add)

    try:
        db.commit()

    except IntegrityError:
        db.rollback()
        raise DbError()

    db.refresh(db_add)
    return db_add


def service_get_ads(skip, limit, ad, db):
    query = db.query(Ad).filter(Ad.status == Status.ACTIVE)

    if ad.category:
        query = query.filter(Ad.category == ad.category)

    if ad.min_price is not None:  # Так делаем из за того что у нас Decimal
        query = query.filter(Ad.price >= ad.min_price)

    if ad.max_price is not None:  # Так делаем из за того что у нас Decimal
        query = query.filter(Ad.price <= ad.max_price)

    if ad.search:
        query = query.filter(Ad.title.ilike(f"%{ad.search}%"))

    if ad.sort_by == "date_desc":
        query = query.order_by(desc(Ad.created_at))

    elif ad.sort_by == "date_asc":
        query = query.order_by(asc(Ad.created_at))

    elif ad.sort_by == "price_desc":
        query = query.order_by(desc(Ad.price))

    elif ad.sort_by == "price_asc":
        query = query.order_by(asc(Ad.price))

    elif ad.sort_by == 'views_desc':
        query = query.order_by(desc(Ad.views))

    elif ad.sort_by == 'views_asc':
        query = query.order_by(asc(Ad.views))

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return {"total": total, "items": items}


def service_get_ad(ad_id, user, db):
    db_ad = db.query(Ad).filter(
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

    if ad.title is None and ad.description is None and ad.price is None and ad.category is None:
        raise EmptyRequest()

    if ad.title is not None:
        db_ad.title = ad.title

    if ad.description is not None:
        db_ad.description = ad.description

    if ad.price is not None:
        db_ad.price = ad.price

    if ad.category is not None:
        db_ad.category = ad.category

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
