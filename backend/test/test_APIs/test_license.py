import requests
from .test_auth import get_token_admin, get_token_user, get_token_SuperAdmin

TOKEN_SUPER_ADMIN = get_token_SuperAdmin()
TOKEN_ADMIN = get_token_admin()
TOKEN_USER = get_token_user()

LICENSE_PLATE_HISTORY_ID = None
DEVICE_ID_FOR_LICENSE_PLATE = "2603700"


def test_create_license_plate_history_as_admin():
    global LICENSE_PLATE_HISTORY_ID
    response = requests.post(
        "http://backend:8000/api/v1/license-plate-history",
        headers={
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
        json={
            "device_id": "",
            "license_plate": "TEST-1234",
            "start_date": "2025-05-08T12:00:00Z",
            "end_date": "2025-06-08T12:00:00Z",
        },
    )
    data = response.json()
    print("data", data)
    assert response.status_code == 201
    assert data["license_plate"] == "TEST-1234"
    LICENSE_PLATE_HISTORY_ID = data["id"]


def test_create_license_plate_history_unauthorized():
    response = requests.post(
        "http://backend:8000/api/v1/license-plate-history",
        headers={
            "device_id": DEVICE_ID_FOR_LICENSE_PLATE,
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN_USER}",
        },
        json={
            "license_plate": "FAIL-USER",
            "start_date": "2025-05-08T12:00:00Z",
            "end_date": "2025-06-08T12:00:00Z",
        },
    )
    assert response.status_code in [403, 401]


def test_get_license_plate_history_list():
    response = requests.get(
        "http://backend:8000/api/v1/license-plate-history",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_SUPER_ADMIN}",
        },
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_license_plate_history_by_device():
    response = requests.get(
        f"http://backend:8000/api/v1/license-plate-history/{DEVICE_ID_FOR_LICENSE_PLATE}",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert data[0]["device_id"] == DEVICE_ID_FOR_LICENSE_PLATE


def test_delete_license_plate_history_as_admin():
    if LICENSE_PLATE_HISTORY_ID is None:
        test_create_license_plate_history_as_admin()

    response = requests.delete(
        f"http://backend:8000/api/v1/license-plate-history/{LICENSE_PLATE_HISTORY_ID}",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
    )
    assert response.status_code == 204


def test_delete_license_plate_history_as_user_forbidden():
    if LICENSE_PLATE_HISTORY_ID is None:
        test_create_license_plate_history_as_admin()

    response = requests.delete(
        f"http://backend:8000/api/v1/license-plate-history/{LICENSE_PLATE_HISTORY_ID}",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_USER}",
        },
    )
    assert response.status_code == 403
