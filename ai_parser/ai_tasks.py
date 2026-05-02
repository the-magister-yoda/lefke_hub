import os
import json

from google import genai
from dotenv import load_dotenv


load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


async def analyze_with_ai(text):
    category_slug = ["electronics", "phones", "cars", "home-decor", "books", "other", "laptops", "clothes", "services", "furniture", "rent"]

    prompt = f"""
    Ты — эксперт по анализу объявлений. Твоя задача: извлечь данные в JSON.
    КАТЕГОРИИ: {", ".join(category_slug)}

    ПРАВИЛА:
    1. 'price' — только ЧИСЛО (целое или дробное). Если цена не указана, пиши 0.
    2. 'category_slug' — выбери ОДНО значение из списка выше.
    3. 'description' — вставь локацию, контакты и текст. Если валюта не EUR, напиши цену с валютой прямо в первой строке описания.
    4. 'title' — не более 60 символов.

    JSON:
    {{
      "is_ad": true,
      "title": "название",
      "description": "текст",
      "price": 200.0, 
      "category_slug": "slug"
    }}
    Если не объявление — {{"is_ad": false}}
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{prompt}\n\nТекст сообщения: {text}",
            config={
                "response_mime_type": "application/json"
            }
        )

        return json.loads(response.text)

    except Exception as e:
        return {"is_ad": False}


async def get_embedding(title: str, description: str):
    # Генерируем вектор для текста объявления
    text_to_embed = f"{title}\n{description}"

    try:
        response = client.models.embed_content(
            model="gemini-embedding-2",
            contents=text_to_embed
        )
        # Возвращаем список чисел (вектор)
        return response.embeddings[0].values

    except Exception as e:
        print(f"Ошибка {e}")
        return None
