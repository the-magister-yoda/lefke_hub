from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import users, ads


app = FastAPI()

app.include_router(users.router, prefix='/users')
app.include_router(ads.router, prefix='/ads')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # заменить это на адрес фронта
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
