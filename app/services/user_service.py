from sqlalchemy import desc, asc
from sqlalchemy.exc import IntegrityError

from app.models import User, Status, UserRole
from app.errors import UserNotFound, UsernameAlreadyExists, UserActive, AlreadyDeleted, NotRights
from app.errors import DbError, WrongPassword, EmailAlreadyExists, PhoneNumAlreadyExists, EmptyRequest
from app.core.security import hash_password, verify_password, create_access_token


def service_register_user(user, db):
    existing_user = db.query(User).filter(
        (User.username == user.username) |
        (User.email == user.email) |
        (User.phone_number == user.phone_number)
    ).first()

    if existing_user is not None:
        if existing_user.username == user.username:
            raise UsernameAlreadyExists()

        elif existing_user.email == user.email:
            raise EmailAlreadyExists()

        elif existing_user.phone_number == user.phone_number:
            raise PhoneNumAlreadyExists()

    hashed_password = hash_password(user.password)

    db_user = User(username=user.username, email=user.email, phone_number=user.phone_number, hashed_password=hashed_password)
    db.add(db_user)

    try:
        db.commit()

    except IntegrityError:
        db.rollback()
        raise DbError()

    db.refresh(db_user)
    return db_user


def service_login_user(form_data, db):
    db_user = db.query(User).filter(User.username == form_data.username).first()

    if db_user is None:
        raise UserNotFound()

    if not verify_password(form_data.password, db_user.hashed_password):
        raise WrongPassword()

    access_token = create_access_token(
        data={"sub": str(db_user.id), "role": db_user.role.value}
    )

    return {"access_token": access_token, "token_type": "bearer"}


def service_get_user(user_id, db):
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise UserNotFound()

    return db_user


def service_update_user(user_data, current_user, db):
    db_user = db.query(User).filter(User.id == current_user.id).first()

    if not db_user:
        raise UserNotFound()

    if user_data.email:
        user = db.query(User).filter(User.email == user_data.email).first()

        if user:
            raise EmailAlreadyExists()

        else:
            db_user.email = user_data.email

    if user_data.phone_number:
        user = db.query(User).filter(User.phone_number == user_data.phone_number).first()

        if user:
            raise PhoneNumAlreadyExists()

        else:
            db_user.phone_number = user_data.phone_number

    if user_data.password:
        hashed_password = hash_password(user_data.password)
        db_user.hashed_password = hashed_password

    if user_data.email is None and user_data.phone_number is None and user_data.password is None:
        raise EmptyRequest()

    db.commit()
    db.refresh(db_user)

    return db_user


def service_delete_user(user_id, current_user, db):
    db_user = db.query(User).filter(User.id == user_id).first()

    if db_user is None:
        raise UserNotFound()

    if db_user.id != current_user.id and db_user.role != UserRole.ADMIN:
        raise NotRights()

    if db_user.status == Status.ARCHIVED:
        raise AlreadyDeleted()

    db_user.status = Status.ARCHIVED

    db.commit()
    db.refresh(db_user)

    return db_user


def service_restore_user(user, db):
    db_user = db.query(User).filter(User.username == user.username).first()

    if db_user is None:
        raise UserNotFound()

    if db_user.status == Status.ACTIVE:
        raise UserActive()

    db_user.status = Status.ACTIVE

    db.commit()
    db.refresh(db_user)

    return db_user


def service_get_me(current_user, db):
    db_user = db.query(User).filter(User.id == current_user.id).first()

    if not db_user:
        raise UserNotFound()

    return db_user


def service_get_all_users(skip, limit, user, user_filter, db):
    if user.role != UserRole.ADMIN:
        raise NotRights()

    query = db.query(User)

    if user_filter.only_active:
        query = query.filter(User.status == Status.ACTIVE)

    if user_filter.search:
        query = query.filter(User.username.ilike(f"%{user_filter.search}%"))

    if user_filter.sort_by == 'date_desc':
        query = query.order_by(desc(User.created_at))

    elif user_filter.sort_by == 'date_asc':
        query = query.order_by(asc(User.created_at))

    total = query.count()

    if total == 0:
        raise UserNotFound()

    items = query.offset(skip).limit(limit).all()

    return {"total": total, "items": items}




