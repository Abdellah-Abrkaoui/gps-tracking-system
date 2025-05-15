from typing import List

from fastapi import APIRouter, Depends
from fastapi_pagination import paginate, LimitOffsetPage

from core.dependencies import (
    authentication_required,
    decode_jwt_token,
    oauth2_scheme,
)
from core.exceptions import NotFoundError
from crud.license_plate_history import (
    get_license_plate_history,
    get_license_plate_history_by_user_id,
)
from db.database import Session, get_session
from schemas.license_plate_history import (
    LicensePlateHistoryRead,
)

router = APIRouter(
    prefix="/license-plate-history",
    tags=["License Plate History"],
    dependencies=[Depends(authentication_required)],
)


@router.get(
    "",
    response_model=LimitOffsetPage[LicensePlateHistoryRead],
)
def read_license_plate_histories(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    token = decode_jwt_token(token)

    if token.get("is_admin"):
        license_plate_history = get_license_plate_history(session)
    else:
        license_plate_history = get_license_plate_history_by_user_id(
            session, token["id"]
        )

    if not license_plate_history:
        raise NotFoundError("No license plate history found")

    return paginate(license_plate_history)
