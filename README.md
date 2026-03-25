LefkeHub — Сайт портал для студентов и жителей региона

Сервис для публикации объявлений (продажа вещей, услуги, поиск соседей). 
Проект написан с фокусом на производительность и чистую архитектуру.

🚀 Основной стек:

Backend: FastAPI, SQLAlchemy (PostgreSQL), Pydantic.

Frontend: React + Vite.

Infra: Docker & Docker-compose, Nginx (reverse proxy).

Optimization: Redis (caching), Alembic (migrations).

Testing: Pytest.

🛠 Что внутри (Особенности):

Архитектура: Использовал Service Layer — бизнес-логика отделена от роутов, код легко тестировать и масштабировать.

Auth: Полноценная авторизация на JWT (Access & Refresh tokens).

DB: Реализованы сложные связи (Many-to-Many для "Избранного"). Миграции через Alembic.

Performance: Кеширование тяжелых запросов в Redis и оптимизация ORM-запросов (минимизация N+1).

DevOps: Проект полностью контейнеризирован. Настроен автоматический деплой через Nginx с SSL (Certbot).

📦 Как запустить локально (Docker)

Тебе понадобится установленный Docker и Docker-compose.

Клонируй репозиторий:

Bash

git clone https://github.com/твой-логин/lefke-hub.git

cd lefke-hub

Настрой окружение:

Создай файл .env в корне (можешь скопировать из .env.example):

Bash

cp .env.example .env

Запусти проект:

Bash

docker-compose up --build

Примени миграции:

Bash

docker-compose exec backend alembic upgrade head

Готово! * API будет доступно по адресу: http://localhost:8000

Swagger (документация): http://localhost:8000/docs

Frontend: http://localhost:3000 (или твой порт)

🧪 Тестирование
Запуск тестов внутри контейнера:

Bash
docker-compose exec backend pytest

Контакт для связи: https://t.me/derbayevv