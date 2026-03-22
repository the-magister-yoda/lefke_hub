import pytest
from fastapi.testclient import TestClient
from app.main import app


client = TestClient(app)


def test_read_main():
    response = client.get("/user/me") # Это вызовет 401, т.к нет токена
    assert response.status_code == 401 

def test_register_user_logic():
    # Производим регис-ию
    payload = {
        "username": "test_student_1",
        "email": "student1@example.com",
        "password": "securepassword",
        "phone_number": "87771112233"
    }
    
    response = client.post("/user/register", json=payload)
    
    # Если такой юзер уже есть в бд, бэк вернет ошибку 400)
    # Если в бд нету такого юзера то, вернет 200
    assert response.status_code in [200, 400]