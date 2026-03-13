from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.routers import users, ads, categories


app = FastAPI()

app.include_router(users.router, prefix='/user')
app.include_router(ads.router, prefix='/ad')
app.include_router(categories.router, prefix='/category')

UPLOAD_DIR = "uploads"

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # заменить это на адрес фронта
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

