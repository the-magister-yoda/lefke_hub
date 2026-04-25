import smtplib
from email.mime.text import MIMEText
from app.core.celery_app import celery_app
from app.core.config import settings


@celery_app.task(name="send_reset_password_email")
def send_reset_password_email(email: str, password: str):
    msg = MIMEText(f"Временный пароль: {password}")
    msg["Subject"] = "Сброс пароля - LefkeHub"
    msg["From"] = settings.EMAIL_FROM
    msg["To"] = email

    # Используем стандартный smtplib внутри Celery воркера
    with smtplib.SMTP_SSL(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
        server.login(settings.EMAIL_USER, settings.EMAIL_PASSWORD)
        server.send_message(msg)
