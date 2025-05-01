import pytest
import requests


def test_Auth() -> str:
    # Test user registration
    response = requests.post(
        "http://localhost:8000/api/v1/auth",
        json={
            "username": "testuser",
            "password": "testpassword",
        })
    assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
    if response.status_code != 200:
        print(f"Response content: {response.json().get("msg")}")
    assert response.json().get("access_token") is not None, "Access token not found in response"
    return response.json().get("access_token")


