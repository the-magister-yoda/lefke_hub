from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from functools import wraps

from app.database import get_db
from app.schemas import UserCreate, UserResponse, UserLogin, TokenResponse
from app.services.user_service import service_register_user, service_login_user
from app.errors import UserNotFound, UsernameAlreadyExists, EmailAlreadyExists, PhoneNumAlreadyExists, DbError


router = APIRouter()


def handle_user_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)

        except UserNotFound:
            raise HTTPException(status_code=404, detail="User has not found")

        except UsernameAlreadyExists:
            raise HTTPException(status_code=400, detail="User with this username already exist.")

        except EmailAlreadyExists:
            raise HTTPException(status_code=400, detail="User with this email already exist.")

        except PhoneNumAlreadyExists:
            raise HTTPException(status_code=400, detail="User with this phone number already exist.")

        except DbError:
            raise HTTPException(status_code=500, detail="Database Error please try later.")

    return wrapper


@router.post('/register', response_model=UserResponse)
@handle_user_errors
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return service_register_user(user, db)


@router.post("/login", response_model=TokenResponse)
@handle_user_errors
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    return service_login_user(user, db)


@router.post("/delete/{user_id}", response_model=UserResponse)
@handle_user_errors
def delete_user(user_id: int, db: Session = Depends(get_db)):
    pass




