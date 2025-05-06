import requests
from .test_auth import get_token_admin, get_token_user, get_token_SuperAdmin  

TOKEN_SUPER_ADMIN = get_token_SuperAdmin()
TOKEN_ADMIN = get_token_admin()
TOKEN_USER = get_token_user()

DEVICE_ID_CREATED = None

def test_create_device():
    global DEVICE_ID_CREATED
    response = requests.post(
        "http://backend:8000/api/v1/devices",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}"
        },
        json={"hardware_id": "hw_id_test_123",
              "created_at": "2023-10-01T12:00:00Z",}
    )
    
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    DEVICE_ID_CREATED = data["id"]

def test_create_device_unauthorized():
    response = requests.post(
        "http://backend:8000/api/v1/devices",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_USER}"
        },
        json={"hardware_id": "hw_id_user_attempt"}
    )
    assert response.status_code == 403

def test_read_device_authorized():
    response = requests.get(
        f"http://backend:8000/api/v1/devices/{DEVICE_ID_CREATED}",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}"
        }
    )
    assert response.status_code == 200
    assert response.json()["id"] == DEVICE_ID_CREATED

def test_read_device_forbidden():
    response = requests.get(
        f"http://backend:8000/api/v1/devices/{DEVICE_ID_CREATED}",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_USER}"
        }
    )
    # Depending on your verify_device_access, this might be 403 or 404
    assert response.status_code in [403, 404]

def test_patch_device_as_admin():
    response = requests.patch(
        f"http://backend:8000/api/v1/devices/{DEVICE_ID_CREATED}",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}"
        },
        json={"hardware_id": "updated_hw_id_test_123"}
    )
    assert response.status_code == 200
    assert response.json()["hardware_id"] == "updated_hw_id_test_123"

def test_patch_device_as_user_forbidden():
    response = requests.patch(
        f"http://backend:8000/api/v1/devices/{DEVICE_ID_CREATED}",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_USER}"
        },
        json={"hardware_id": "attempt_by_user"}
    )
    # Backend has no protection here, so this may pass unless enforced via verify_device_access
    assert response.status_code in [403, 404]

def test_list_devices_admin():
    response = requests.get(
        "http://backend:8000/api/v1/devices",
        headers={"Authorization": f"Bearer {TOKEN_ADMIN}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_list_devices_user():
    response = requests.get(
        "http://backend:8000/api/v1/devices",
        headers={"Authorization": f"Bearer {TOKEN_USER}"}
    )
    # This will return user-linked devices or 404 if none exist
    assert response.status_code in [200, 404]

def test_delete_device_as_admin():
    response = requests.delete(
        f"http://backend:8000/api/v1/devices/{DEVICE_ID_CREATED}",
        headers={"Authorization": f"Bearer {TOKEN_ADMIN}"}
    )
    assert response.status_code == 200
    assert response.json()["detail"] == "Device deleted successfully"

def test_delete_device_as_user_forbidden():
    response = requests.delete(
        f"http://backend:8000/api/v1/devices/{DEVICE_ID_CREATED}",
        headers={"Authorization": f"Bearer {TOKEN_USER}"}
    )
    assert response.status_code == 403
