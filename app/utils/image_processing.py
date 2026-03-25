import os

from PIL import Image
from fastapi import UploadFile, HTTPException


MAX_IMAGE_SIZE = 1200
WEBP_QUALITY = 80


def process_and_save_image(file: UploadFile, save_path: str):
    try:
        file.file.seek(0)
        img = Image.open(file.file)

        if img.mode in ('RGBA', 'LA', 'P'):
            bg = Image.new('RGB', img.size, (255, 255, 255))
            mask = img.split()[3] if img.mode == 'RGBA' else None
            bg.paste(img, mask=mask)
            img = gb
        
        elif img.mode != 'RGB':
            img = img.convert('RGB')

        if max(img.width, img.height) > MAX_IMAGE_SIZE:
            img.thumbnail((MAX_IMAGE_SIZE, MAX_IMAGE_SIZE), Image.Resampling.LANCZOS)

        img.save(save_path, format='WEBP', quality=WEBP_QUALITY, optimize=True)

        print(f"Pillow сжал фото и сохранид {save_path}")

    except Exception as e:
        print(f"Ошибка Pillow {e}")
        raise HTTPException(status_code=400, detail="Ошибка при обработке изображения")
