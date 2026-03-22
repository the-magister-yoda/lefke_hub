import pytest
from fastapi.testclient import TestClient
from app.main import app  


client = TestClient(app) 


def test_create_ad_full_cycle():
    # Логиним пользователя
    login_data = {
        "username": "test_student_1",
        "password": "securepassword"
    }
    # Исп-ую Form Data 
    login_res = client.post("/user/login", data=login_data) 
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    # Данные для создания объявления
    ad_form_data = {
        "title": "Macbook air M2",
        "description": "Good looking apple macbook air m2",
        "price": "500", 
        "category_slug": "laptops"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Исп-ем data= а не json=
    # Это имитирует отправку формы с фронтенда
    response = client.post("/ad/create", data=ad_form_data, headers=headers)

    if response.status_code != 200:
        print("\nError:", response.json())

    assert response.status_code == 200