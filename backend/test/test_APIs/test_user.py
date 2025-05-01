import requests
from test_auth import get_token_admin, get_token_user

TOKEN_ADMIN = get_token_admin()
TOKEN_USER = get_token_user()
# test read user

def test_read_user_valid():
    response = requests.get(
        "http://backend:8000/api/v1/users/1",
        headers={"accept": "application/json", "Content-Type": "application/json" ,"Authorization": f"Bearer {TOKEN_ADMIN}"},)
        
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert "id" in data, "User ID not found"
    assert data["id"] == 1, f"Expected user ID 1, got {data['id']}"
    assert "username" in data, "Username not found"

def test_read_user_invalid():
    response = requests.get(
        "http://backend:8000/api/v1/users/9999",
        headers={"accept": "application/json", "Content-Type": "application/json" ,"Authorization": f"Bearer {TOKEN_ADMIN}"},)
    assert response.status_code == 404, f"Expected 422, got {response.status_code}"

def test_read_user_unauthorized():
    response = requests.get(
        "http://backend:8000/api/v1/users/1",
        headers={"accept": "application/json", "Content-Type": "application/json" ,"Authorization": f"Bearer {TOKEN_USER}"},)
    assert response.status_code == 403, f"Expected 403, got {response.status_code}"