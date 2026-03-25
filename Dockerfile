# Базовый образ
FROM python:3.11-slim

# Рабочая директория
WORKDIR /app

# Устанавливаем зависимости для Pillow и работы с сетью
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmagic1 \
    && rm -rf /var/lib/apt/lists/*

# Копируем зависимости из корня
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn uvicorn

# Копируем всё содержимое (включая папку app)
COPY . .

# Создаем папку для загрузок
RUN mkdir -p uploads

# Запуск через Gunicorn (Production-ready)
# Обрати внимание на путь app.main:app
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app", "--bind", "0.0.0.0:8000"]