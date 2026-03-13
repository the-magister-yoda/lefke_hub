from sqlalchemy.exc import IntegrityError

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
    return db_category


def service_get_categories(db):
    categories = db.query(Category).all()

    if not categories:
        raise CategoryNotFound()

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