from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from functools import wraps

from app.database import get_db
from app.schemas import UserCreate, UserResponse
from app.services.user_service import service_create_user
from app.errors import UsernameAlreadyExists, EmailAlreadyExists, PhoneNumAlreadyExists, DbError


router = APIRouter()


def handle_user_errors(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)

        except UsernameAlreadyExists:
            raise HTTPException(status_code=400, detail="User with this username already exist.")

        except EmailAlreadyExists:
            raise HTTPException(status_code=400, detail="User with this email already exist.")

        except PhoneNumAlreadyExists:
            raise HTTPException(status_code=400, detail="User with this phone number already exist.")

        except DbError:
            raise HTTPException(status_code=500, detail="Database Error please try later.")

    return wrapper


@router.post('/',response_model=UserResponse)
@handle_user_errors
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return service_create_user(user, db)


