import json

from sqlalchemy.exc import IntegrityError
from sqlalchemy import select

from app.schemas.category_schemas import CategoryResponse
from app.core.redis import redis_client
from app.errors import CategoryNotFound, NotRights, DbError
from app.models import User, UserRole, Category


async def service_create_category(category, current_user, db):
    query = (
        select(User)
        .where(
            (User.id == current_user.id) &
            (User.role == UserRole.ADMIN)
        )
    )

    result = await db.execute(query)
    db_user = result.scalars().first()

    if not db_user:
        raise NotRights()

    db_category = Category(name=category.name, slug=category.slug)
    db.add(db_category)

    try:
        await db.commit()

    except IntegrityError:
        await db.rollback()
        raise DbError()

    await db.refresh(db_category)

    await redis_client.delete("all_categories")

    return db_category


async def service_get_categories(db):
    cached = await redis_client.get("all_categories")

    if cached:
        return json.loads(cached)

    query = select(Category)
    
    result = await db.execute(query)
    categories = result.scalars().all()

    if not categories:
        raise CategoryNotFound()

    categories_for_cache = [
        CategoryResponse.model_validate(cat).model_dump() 
        for cat in categories
    ]

    await redis_client.set(
        "all_categories", 
        json.dumps(categories_for_cache, ensure_ascii=False),
        ex=86400 
    )

    return categories_for_cache


async def service_delete_category(slug, current_user, db):
    query = (
        select(User)
        .where(
            (User.id == current_user.id) &
            (User.role == UserRole.ADMIN)
        )
    )
    
    result = await db.execute(query)
    db_user = result.scalars().first()

    if not db_user:
        raise NotRights()

    query = (
        select(Category)
        .where(
            (Category.slug == slug) &
            (Category.status == Status.ACTIVE)
        )
    )

    result = await db.execute(query)
    db_category = result.scalars().first()

    if not db_category:
        raise CategoryNotFound()

    db_category.status = Status.ARCHIVED

    try:
        await db.commit()

    except IntegrityError:
        await db.rollback()
        raise DbError()
    
    await redis_client.delete("all_categories")
    return {"status": "deleted successfully"}