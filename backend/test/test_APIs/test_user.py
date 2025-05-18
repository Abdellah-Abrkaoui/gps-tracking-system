import requests

from .test_auth import get_token_admin, get_token_SuperAdmin, get_token_user

TOKEN_SUPER_ADMIN = get_token_SuperAdmin()
TOKEN_ADMIN = get_token_admin()
TOKEN_USER = get_token_user()

ID_ADMIN_CREATED = 0
ID_USER_CREATED = 0


# test modify user
def test_modify_AdminBySuperAdmin():
    response = requests.patch(
        "http://backend:8000/api/v1/users/2",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_SUPER_ADMIN}",
        },
        json={"username": "mod_admin", "password": "new_password"},
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"


def test_modify_SuperAdminByAdmin():
    response = requests.patch(
        "http://backend:8000/api/v1/users/1",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
        json={"username": "mod_superadmin", "password": "new_password"},
    )
    assert response.status_code == 403, f"Expected 403, got {response.status_code}"


def test_modify_UserByAdmin():
    response = requests.patch(
        "http://backend:8000/api/v1/users/3",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
        json={"username": "mod_user", "password": "new_password"},
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"


# test create users


def test_create_user():
    global ID_USER_CREATED
    response = requests.post(
        "http://backend:8000/api/v1/users",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
        json={"username": "new_user989", "password": "new_password", "is_admin": False},
    )
    data = response.json()
    ID_USER_CREATED = data["id"]
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    assert "id" in data, "User ID not found"


def test_create_admin():
    global ID_ADMIN_CREATED
    response = requests.post(
        "http://backend:8000/api/v1/users",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
        json={"username": "new_admin989", "password": "new_password", "is_admin": True},
    )
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    data = response.json()
    assert "id" in data, "User ID not found"
    ID_ADMIN_CREATED = data["id"]


def test_create_user_invalid():
    response = requests.post(
        "http://backend:8000/api/v1/users",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_USER}",
        },
        json={"username": "new_user000", "password": "new_password", "is_admin": False},
    )
    assert response.status_code == 403, f"Expected 403, got {response.status_code}"


def test_create_user_Already_exists():
    response = requests.post(
        "http://backend:8000/api/v1/users",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
        json={"username": "new_user989", "password": "new_password", "is_admin": False},
    )
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"


# test delete user


def test_delete_user():
    response = requests.delete(
        f"http://backend:8000/api/v1/users/{int(ID_USER_CREATED)}",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    print("res", response)


def test_delete_admin():
    response = requests.delete(
        f"http://backend:8000/api/v1/users/{int(ID_ADMIN_CREATED)}",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_SUPER_ADMIN}",
        },
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"


def test_delete_user_invalid():
    response = requests.delete(
        "http://backend:8000/api/v1/users/9999",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
    )
    assert response.status_code == 500, f"Expected 500, got {response.status_code}"


def test_delete_user_unauthorized():
    response = requests.delete(
        "http://backend:8000/api/v1/users/1",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_USER}",
        },
    )
    assert response.status_code == 403, f"Expected 403, got {response.status_code}"


def test_delete_user_invalid_admin():
    response = requests.delete(
        "http://backend:8000/api/v1/users/2",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
    )
    assert response.status_code == 403, f"Expected 403, got {response.status_code}"
