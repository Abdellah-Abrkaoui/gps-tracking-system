from typing import List

from fastapi import APIRouter, Depends
from fastapi_pagination import LimitOffsetPage
from fastapi_pagination.ext.sqlmodel import paginate

from core.dependencies import (
    authentication_required,
    decode_jwt_token,
    oauth2_scheme,
)
from core.exceptions import NotFoundError
from crud.location import (
    get_locations,
    get_locations_by_user_id,
)
from db.database import Session, get_session
from schemas.location import LocationRead

router = APIRouter(
    prefix="/locations",
    tags=["Location"],
    dependencies=[Depends(authentication_required)],
)


@router.get("", response_model=LimitOffsetPage[LocationRead])
def read_locations(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    token = decode_jwt_token(token)

    if token.get("is_admin"):
        locations = get_locations(session)
    else:
        locations = get_locations_by_user_id(session, token["id"])

    if locations is None:
        raise NotFoundError("No locations found")

    return paginate(session, locations)
