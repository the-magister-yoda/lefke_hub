from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# Это асинхронный движок
engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo = True,
)

# Сохдаем тут фабрику асинхронных сессий
AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession,
    expire_on_commit=False
)


Base = declarative_base()

# Асинхронный генератор для получения сессии БД т.е возможность открыть бд и закрыть 
async def get_db():
    async with AsyncSessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()
