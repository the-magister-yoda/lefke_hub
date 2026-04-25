import secrets 

from sqlalchemy import select, desc, asc, func
from sqlalchemy.exc import IntegrityError

from app.models import User, Status, UserRole
from app.errors import UserNotFound, UsernameAlreadyExists, UserActive, AlreadyDeleted, NotRights
from app.errors import DbError, WrongPassword, EmailAlreadyExists, PhoneNumAlreadyExists, EmptyRequest
from app.utils.email_send import send_reset_password_email
from app.core.security import hash_password, verify_password, create_access_token


async def service_register_user(user, db):
    query = (
        select(User)
        .where(
            (User.username == user.username) |
            (User.email == user.email) |
            (User.phone_number == user.phone_number)
        )
    )

    result = await db.execute(query)
    existing_user = result.scalar()

    if existing_user is not None:
        if existing_user.username == user.username:
            raise UsernameAlreadyExists()

        elif existing_user.email == user.email:
            raise EmailAlreadyExists()

        elif existing_user.phone_number == user.phone_number:
            raise PhoneNumAlreadyExists()

    hashed_password = hash_password(user.password)

    db_user = User(username=user.username, email=user.email, 
                phone_number=user.phone_number, 
                hashed_password=hashed_password
            )

    db.add(db_user)

    try:
        await db.commit()

    except IntegrityError:
        await db.rollback()
        raise DbError()

    await db.refresh(db_user)
    return db_user


async def service_login_user(form_data, db):
    query = select(User).where(User.username == form_data.username)
    
    result = await db.execute(query)
    db_user = result.scalar()

    if db_user is None:
        raise UserNotFound()

    if not verify_password(form_data.password, db_user.hashed_password):
        raise WrongPassword()

    access_token =  await create_access_token(
        data={"sub": str(db_user.id), "role": db_user.role.value}
    )

    return {"access_token": access_token, "token_type": "bearer"}


async def service_get_user(user_id, db):
    query = select(User).where(User.id == user_id)

    result = await db.execute(query)
    db_user = result.scalar()

    if not db_user:
        raise UserNotFound()

    return db_user


async def service_update_user(user_data, current_user, db):
    query = select(User).where(User.id == current_user.id)

    result = await db.execute(query)
    db_user = result.scalar()

    if not db_user:
        raise UserNotFound()

    if user_data.email:
        query = select(User).where(User.email == user_data.email)

        result = await db.execute(query)
        user = result.scalar()

        if user:
            raise EmailAlreadyExists()

        else:
            db_user.email = user_data.email

    if user_data.phone_number:
        query = select(User).where(User.phone_number == user_data.phone_number)
        
        result = await db.execute(query)
        user = result.scalar()

        if user:
            raise PhoneNumAlreadyExists()

        else:
            db_user.phone_number = user_data.phone_number

    if user_data.password:
        hashed_password = hash_password(user_data.password)
        db_user.hashed_password = hashed_password

    if user_data.email is None and user_data.phone_number is None and user_data.password is None:
        raise EmptyRequest()

    await db.commit()
    await db.refresh(db_user)

    return db_user


async def service_delete_user(user_id, current_user, db):
    query = select(User).where(User.id == user_id)

    result = await db.execute(query)
    db_user = result.scalar()

    if db_user is None:
        raise UserNotFound()

    if db_user.id != current_user.id and db_user.role != UserRole.ADMIN:
        raise NotRights()

    if db_user.status == Status.ARCHIVED:
        raise AlreadyDeleted()

    db_user.status = Status.ARCHIVED

    await db.commit()
    await db.refresh(db_user)

    return db_user


async def service_restore_password(username, email, db):
    query = (
        select(User)
        .where(
            (User.username == username) &
            (User.email == email)
        )
    )

    result = await db.execute(query)
    db_user = result.scalar()

    if not db_user:
        raise UserNotFound()

    temp_password = secrets.token_hex(4)
    hashed_password = hash_password(temp_password)

    try:
        db_user.hashed_password = hashed_password
        await db.commit()

    except IntegrityError:
        await db.rollback()
        raise DbError()

    send_reset_password_email.delay(db_user.email, temp_password)


async def service_get_me(current_user, db):
    query = select(User).where(User.id == current_user.id)

    result = await db.execute(query)
    db_user = result.scalar()

    if not db_user:
        raise UserNotFound()

    return db_user


async def service_get_all_users(skip, limit, user, user_filter, db):
    if user.role != UserRole.ADMIN:
        raise NotRights()

    query = select(User)

    if user_filter.only_active:
        query = query.where(User.status == Status.ACTIVE)

    if user_filter.search:
        query = query.where(User.username.ilike(f"%{user_filter.search}%"))

    if user_filter.sort_by == 'date_desc':
        query = query.order_by(desc(User.created_at))
    elif user_filter.sort_by == 'date_asc':
        query = query.order_by(asc(User.created_at))

    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    if total == 0:
        raise UserNotFound()

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    items = result.scalars().all() 

    return {"total": total, "items": items}


async def service_create_admin(user, db):
    query = (
        select(User)
        .where(
            (User.id == user.id) &
            (User.role == UserRole.USER)
        )
    )

    result = await db.execute(query)
    db_user = result.scalar()

    if not db_user:
        raise UserNotFound()
    
    db_user.role = UserRole.ADMIN

    await db.commit()
    await db.refresh(db_user)

    return db_user

    

