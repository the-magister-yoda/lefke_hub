import redis
import os


REDIS_URL = os.getenv("REDIS_URL")


# Создание клиента он автоматически упр-ет пулом соединений
redis_client = redis.from_url(
    REDIS_URL, 
    encoding="utf-8", 
    decode_responses=True
)

def get_redis():
    return redis_client