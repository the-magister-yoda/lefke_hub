from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import UserCreate, UserResponse



router = APIRouter()


@router.post('/',response_model=UserResponse)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    return


