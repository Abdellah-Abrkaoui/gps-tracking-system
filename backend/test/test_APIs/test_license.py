import requests
from .test_auth import get_token_admin, get_token_user, get_token_SuperAdmin

TOKEN_SUPER_ADMIN = get_token_SuperAdmin()
TOKEN_ADMIN = get_token_admin()
TOKEN_USER = get_token_user()

LICENSE_PLATE_HISTORY_ID = None
DEVICE_ID_FOR_LICENSE_PLATE = "2603700"


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


