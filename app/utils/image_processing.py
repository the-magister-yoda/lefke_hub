import anyio

from PIL import Image
from fastapi import UploadFile, HTTPException
from io import BytesIO

MAX_IMAGE_SIZE = 1200
WEBP_QUALITY = 80

def _sync_process_image(content: bytes, save_path: str):
    """Синхронная часть обработки, которая будет выполняться в потоке"""
    try:
        img = Image.open(BytesIO(content))

        # Исправил твою опечатку: было 'img = gb', должно быть 'img = bg'
        if img.mode in ('RGBA', 'LA', 'P'):
            bg = Image.new('RGB', img.size, (255, 255, 255))
            mask = img.split()[3] if img.mode == 'RGBA' else None
            bg.paste(img, mask=mask)
            img = bg
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        if max(img.width, img.height) > MAX_IMAGE_SIZE:
            img.thumbnail((MAX_IMAGE_SIZE, MAX_IMAGE_SIZE), Image.Resampling.LANCZOS)

        img.save(save_path, format='WEBP', quality=WEBP_QUALITY, optimize=True)
        return True
    except Exception as e:
        print(f"Ошибка Pillow: {e}")
        return False


async def process_and_save_image(file: UploadFile, save_path: str):
    try:
        # Читаем файл асинхронно
        content = await file.read()
        
        # Запускаем тяжелую обработку в отдельном потоке (Worker Thread)
        # Это не даст серверу "зависнуть"
        success = await anyio.to_thread.run_sync(_sync_process_image, content, save_path)

        if not success:
            raise HTTPException(status_code=400, detail="Ошибка при обработке изображения")

        print(f"Pillow успешно сохранил {save_path}")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Ошибка: {str(e)}")
    finally:
        await file.seek(0) # Возвращаем указатель в начало на всякий случай)
