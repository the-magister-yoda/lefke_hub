import httpx
import json
import os

from ai_tasks import get_embedding
from dotenv import load_dotenv


load_dotenv()
username = os.getenv("USERNAME_TG_BOT")
password = os.getenv("PASSWORD_TG_BOT")


async def login_to_api():
    url = "http://127.0.0.1:8000/user/login"

    payload = {
        "username": username, 
        "password": password
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, data=payload)

        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data.get('access_token')
            return access_token
        
        else:
            return None

    
async def send_to_api(ad_data: dict, photo_path: str, token: str):
    vector = await get_embedding(ad_data['title'], ad_data['description'])

    url = "http://127.0.0.1:8000/ad/create"
    headers = {
        "Authorization": f"Bearer {token}"
    }

    form_payload = {
        "title": str(ad_data['title']),
        "description": str(ad_data['description']),
        "price": ad_data['price'],
        "category_slug": ad_data['category_slug'],
        "embedding": json.dumps(vector) if vector else None
    }

    files = []
    if photo_path and os.path.exists(photo_path):
        files.append(
            ("images", (os.path.basename(photo_path), open(photo_path, "rb"), "image/jpeg"))
            )

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                data=form_payload,
                files=files,
                headers=headers
            )

            if response.status_code == 200:
                return response.json()

            else:
                return None

    except Exception as e:
        raise e

    finally:
        for _, file_info in files:
            file_info[1].close()
