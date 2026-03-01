from sqlalchemy.exc import IntegrityError

from app.models import User, Status
from app.errors import UserNotFound, UsernameAlreadyExists, UserActive, AlreadyDeleted
from app.errors import DbError, WrongPassword, EmailAlreadyExists, PhoneNumAlreadyExists
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


def service_delete_user(current_user, db):
    db_user = db.query(User).filter(User.id == current_user.id).first()

    if db_user is None:
        raise UserNotFound()

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



