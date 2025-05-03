import requests


def test_auth():
    response = requests.post(
        "http://backend:8000/api/v1/auth",
        headers={"accept": "application/json", "Content-Type": "application/json"},
        json={"username": "admin", "password": "admin"},
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert "access_token" in data, "Access token not found"
    return data["access_token"]
