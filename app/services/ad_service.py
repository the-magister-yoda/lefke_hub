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


def service_get_ads(user, db):
    ads = db.query(Ad).filter(
        (Ad.owner_id == user.id) &
        (Ad.status == Status.ACTIVE)
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

    if db_ad is None:
        raise AdsNotFound()

    db_ad.status = Status.ARCHIVED

    db.commit()
    db.refresh(db_ad)

    return db_ad
