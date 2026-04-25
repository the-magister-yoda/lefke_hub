import os
import redis.asyncio as redis
from app.core.config import settings

REDIS_URL = settings.REDIS_URL

# Создаем пул соединений 
pool = redis.ConnectionPool.from_url(
    REDIS_URL,
    encoding="utf-8",
    decode_responses=True
)


def get_redis() -> redis.Redis:
    return redis.Redis(connection_pool=pool)

redis_client = redis.Redis(connection_pool=pool)
