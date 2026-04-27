import os
import asyncio

from pyrogram import Client,
from dotenv import load_dotenv
from ai_parser.ai_tasks import analyze_with_ai
from ai_parser.api_tasks import login_to_api, send_to_api


load_dotenv()


API_TOKEN = None
api_id = os.getenv("TELEGRAM_API_ID")
api_hash = os.getenv("TELEGRAM_API_HASH")


class Parser(Client):
    async def start_bot(self):
        global API_TOKEN

        API_TOKEN = await login_to_api()

        if not API_TOKEN:
            return

        return await super().start()


app = Parser("my_account", api_id=api_id, api_hash=api_hash)


async def handle_photo(client, message):
    if message.photo:
        file_path = await message.download()
        return file_path

    return None


@app.on_message(filters.text | filters.photo)
async def catch_message(client, message):
    global API_TOKEN

    raw_text = message.text or message.caption

    if not raw_text or len(raw_text) < 15:
        return
    
    ai_result = await analyze_with_ai(raw_text)

    if ai_result.get("is_ad"):
        photo_path = None
        if message.photo:
            photo_path = await message.download()

        await send_to_api(ai_result, photo_path, API_TOKEN)

        if photo_path and os.path.exists(photo_path):
            os.remove(photo_path)

    else:
        print("ИИ проигнорировал не объявление")


if __name__ == "__main__":
    app.run()




