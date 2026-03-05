from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from functools import wraps
from typing import List

from app.models import User
from app.database import get_db
from app.errors import UserNotFound, UsernameAlreadyExists, UserActive, EmailAlreadyExists, PhoneNumAlreadyExists, WrongPassword, AlreadyDeleted, NotRights, DbError
from app.services.user_service import service_register_user, service_login_user, service_delete_user, service_restore_user, service_get_me, service_get_all_users
from app.schemas.user_schemas import UserCreate, UserResponse, UserLogin, TokenResponse, UserListResponse, UserFullResponse, UserFilterSchema
from app.core.dependencies import get_current_user


router = APIRouter()


def handle_user_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)

        except UserNotFound:
            raise HTTPException(status_code=404, detail="User has not found.")

        except UsernameAlreadyExists:
            raise HTTPException(status_code=400, detail="User with this username already exist.")

        except EmailAlreadyExists:
            raise HTTPException(status_code=400, detail="User with this email already exist.")

        except PhoneNumAlreadyExists:
            raise HTTPException(status_code=400, detail="User with this phone number already exist.")

        except WrongPassword:
            raise HTTPException(status_code=400, detail="Oops wrong password, please try another.")

        except AlreadyDeleted:
            raise HTTPException(status_code=400, detail="User has been already deleted.")

        except UserActive:
            raise HTTPException(status_code=400, detail="Wrong request user is already active.")

        except NotRights:
            raise HTTPException(status_code=400, detail="You have no proper right for this operation.")

        except DbError:
            raise HTTPException(status_code=500, detail="Database Error please try later.")

    return wrapper


@router.post('/register', response_model=UserResponse)
@handle_user_errors
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return service_register_user(user, db)


@router.post("/login", response_model=TokenResponse)
@handle_user_errors
def login_user(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return service_login_user(form_data, db)


@router.delete("/delete/{user_id}", response_model=UserResponse)
@handle_user_errors
def delete_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_delete_user(user_id, current_user, db)


@router.post("/restore", response_model=UserResponse)
@handle_user_errors
def restore_user(user: UserLogin, db: Session = Depends(get_db)):
    return service_restore_user(user, db)


@router.get("/me", response_model=UserFullResponse)
@handle_user_errors
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_get_me(current_user, db)


# Функция для админа чтобы просмотреть сразу всех пользователей потом можно добавить сортировку по дате регистрации и сначала активные потом не актиные.
@router.get("/all_users", response_model=UserListResponse)
@handle_user_errors
def get_all_users(skip: int = 0, limit: int = 10, user: User = Depends(get_current_user), user_filter: UserFilterSchema = Depends(), db: Session = Depends(get_db)):
    return service_get_all_users(skip, limit, user, user_filter, db)

