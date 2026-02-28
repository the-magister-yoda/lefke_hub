from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from functools import wraps

from app.models import User
from app.core.dependencies import get_current_user
from app.database import get_db
from app.schemas import UserCreate, UserResponse, UserLogin, TokenResponse
from app.services.user_service import service_register_user, service_login_user, service_delete_user, service_restore_user
from app.errors import UserNotFound, UsernameAlreadyExists, UserActive, EmailAlreadyExists, PhoneNumAlreadyExists, WrongPassword, AlreadyDeleted, DbError


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
            raise HTTPException(status_code=400, detail="Wrong request user is already active."
                                                        "")
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


@router.post("/delete", response_model=UserResponse)
@handle_user_errors
def delete_user(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return service_delete_user(current_user, db)


@router.post("/restore", response_model=UserResponse)
@handle_user_errors
def restore_user(user: UserLogin, db: Session = Depends(get_db)):
    return service_restore_user(user, db)
