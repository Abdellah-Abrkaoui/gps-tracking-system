
import requests

# return the token for the admin
def get_token_admin():
    reponse = requests.post(
        "http://backend:8000/api/v1/auth",
        headers={"accept": "application/json", "Content-Type": "application/json"},
        json={"username": "admin2", "password": "admin"}
    )
    return reponse.json()["access_token"]
# return the token for the user
def get_token_user():
    reponse = requests.post(
        "http://backend:8000/api/v1/auth",
        headers={"accept": "application/json", "Content-Type": "application/json"},
        json={"username": "user1", "password": "password"}
    )
    print(reponse.json())
    return reponse.json()["access_token"]
# return the token for the SuperAdmin
def get_token_SuperAdmin():
    reponse = requests.post(
        "http://backend:8000/api/v1/auth",
        headers={"accept": "application/json", "Content-Type": "application/json"},
        json={"username": "admin", "password": "admin"}
    )
    return reponse.json()["access_token"]   

# Test the authentication endpoint
def test_auth():
    response = requests.post(
    "http://backend:8000/api/v1/auth",
    headers={"accept": "application/json", "Content-Type": "application/json"},
    json={"username": "admin", "password": "admin"}
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert "access_token" in data, "Access token not found"
    return response.status_code
    

def test_sqlInjection():
    # Test SQL injection in the username field
    response = requests.post(
        "http://backend:8000/api/v1/auth",
        headers={"accept": "application/json", "Content-Type": "application/json"},
        json={"username": " OR '1'='1", "password": "admin"}
    )
    print(response.status_code)
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"

