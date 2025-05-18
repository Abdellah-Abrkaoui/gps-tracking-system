import requests
from .test_auth import get_token_admin, get_token_user, get_token_SuperAdmin

TOKEN_SUPER_ADMIN = get_token_SuperAdmin()
TOKEN_ADMIN = get_token_admin()
TOKEN_USER = get_token_user()

LOCATION_ID_CREATED = None

#test list locations
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


