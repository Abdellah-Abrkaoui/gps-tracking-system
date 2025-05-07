from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from core.dependencies import (
    admin_only,
    authentication_required,
    decode_jwt_token,
    oauth2_scheme,
    verify_location_access,
)
from crud.location import (
    delete_location,
    get_location_by_id,
    get_locations,
    get_locations_by_user_id,
)
from db.database import Session, get_session
from schemas.location import LocationRead
from core.exceptions import NotFoundError

router = APIRouter(
    prefix="/locations",
    tags=["Location"],
    dependencies=[Depends(authentication_required)],
)


@router.get(
    "/{location_id}",
    dependencies=[Depends(verify_location_access)],
    response_model=LocationRead,
)
def read_location(
    location_id: int,
    session: Session = Depends(get_session),
):
    location = get_location_by_id(session, location_id)
    if not location:
        raise NotFoundError("Location not found")
    return location


@router.get("", response_model=List[LocationRead])
def read_locations(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    token = decode_jwt_token(token)

    if token.get("is_admin"):
        locations = get_locations(session)
    else:
        locations = get_locations_by_user_id(session, token["id"])

    if not locations:
        raise NotFoundError("No locations found")


    return locations


@router.delete(
    "/{location_id}",
    response_model=dict,
    dependencies=[
        Depends(admin_only),
    ],
)
def delete_location_by_id(
    location_id: int,
    session: Session = Depends(get_session),
):
    location = get_location_by_id(session, location_id)
    if not location:
        raise NotFoundError("Location not found")
        
    return delete_location(session, location)
