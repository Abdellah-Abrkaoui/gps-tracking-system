import requests
from .test_auth import get_token_admin, get_token_user, get_token_SuperAdmin

TOKEN_SUPER_ADMIN = get_token_SuperAdmin()
TOKEN_ADMIN = get_token_admin()
TOKEN_USER = get_token_user()

LOCATION_ID_CREATED = None


# test list locations
def test_list_locations_admin():
    response = requests.get(
        "http://backend:8000/api/v1/locations",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)

    global LOCATION_ID_CREATED
    if response.json():
        LOCATION_ID_CREATED = response.json()[0]["id"]


# test get location by id
def test_get_location_by_id_superadmin():
    if LOCATION_ID_CREATED is None:
        test_list_locations_admin()

    response = requests.get(
        f"http://backend:8000/api/v1/locations/{LOCATION_ID_CREATED}",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_SUPER_ADMIN}",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == LOCATION_ID_CREATED
    assert "latitude" in data
    assert "longitude" in data


def test_get_location_by_id_unauthorized_user():
    if LOCATION_ID_CREATED is None:
        test_list_locations_admin()

    response = requests.get(
        f"http://backend:8000/api/v1/locations/{LOCATION_ID_CREATED}",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_USER}",
        },
    )
    assert response.status_code in [401, 403]


# test delete
def test_delete_location_as_admin():
    response = requests.delete(
        f"http://backend:8000/api/v1/locations/{LOCATION_ID_CREATED}",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
    )
    assert response.status_code == 200


def test_delete_location_as_user_forbidden():
    response = requests.delete(
        f"http://backend:8000/api/v1/locations/{LOCATION_ID_CREATED + 1}",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_USER}",
        },
    )
    assert response.status_code == 403


def test_delete_locationNotExist_as_admin():
    response = requests.delete(
        f"http://backend:8000/api/v1/locations/{LOCATION_ID_CREATED}",
        headers={
            "accept": "application/json",
            "Authorization": f"Bearer {TOKEN_ADMIN}",
        },
    )
    assert response.status_code == 404
