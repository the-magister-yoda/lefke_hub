import json

from sqlalchemy.exc import IntegrityError

from app.schemas.category_schemas import CategoryResponse
from app.core.redis import redis_client
from app.errors import CategoryNotFound, NotRights, DbError
from app.models import User, UserRole, Category


def service_create_category(category, current_user, db):
    db_user = db.query(User).filter(
        (User.id == current_user.id) &
        (User.role == UserRole.ADMIN)
    ).first()

    if not db_user:
        raise NotRights()

    db_category = Category(name=category.name, slug=category.slug)
    db.add(db_category)

    try:
        db.commit()

    except IntegrityError:
        db.rollback()
        raise DbError()

    db.refresh(db_category)

    redis_client.delete("all_categories")

    return db_category


def service_get_categories(db):
    cached = redis_client.get("all_categories")

    if cached:
        return json.loads(cached)

    categories = db.query(Category).all()

    if not categories:
        raise CategoryNotFound()

    categories_for_cache = [
        CategoryResponse.model_validate(cat).model_dump() 
        for cat in categories
    ]

    redis_client.setex(
        "all_categories", 
        86400, 
        json.dumps(categories_for_cache)
    )

    return categories


def service_delete_category(slug, current_user, db):
    db_user = db.query(User).filter(
        (User.id == current_user.id) &
        (User.role == UserRole.ADMIN)
    ).first()

    if not db_user:
        raise NotRights()

    db_category = db.query(Category).filter(
        (Category.slug == slug) &
        (Category.status == Status.ACTIVE)
    ).first()

    if not db_category:
        raise CategoryNotFound()

    db_category.status = Status.ARCHIVED

    try:
        db.commit()

    except IntegrityError:
        db.rollback()
        raise DbError()

    return {"status": "deleted successfully"}