from fastapi import APIRouter, Depends, status

from core.dependencies import (
    admin_only,
    authentication_required,
    oauth2_scheme,
    verify_license_plate_history_access,
)
from crud.license_plate_history import (
    delete_license_plate_history,
    get_license_plate_histories_by_device,
    get_license_plate_history_by_id,
)
from db.database import Session, get_session
from db.models import LicensePlateHistory
from schemas.license_plate_history import (
    LicensePlateHistoryCreate,
    LicensePlateHistoryRead,
)

router = APIRouter(
    prefix="/license-plates",
    tags=["License Plate History"],
    dependencies=[Depends(authentication_required)],
)


@router.get("/{device_id}", response_model=list[LicensePlateHistoryRead])
def list_license_plate_histories(
    device_id: int,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    return get_license_plate_histories_by_device(session, device_id)


@router.get(
    "/{history_id}",
    response_model=LicensePlateHistoryRead,
    dependencies=[Depends(verify_license_plate_history_access)],
)
def read_license_plate_history(
    history_id: int,
    session: Session = Depends(get_session),
):
    return get_license_plate_history_by_id(session, history_id)


@router.post(
    "/",
    response_model=LicensePlateHistoryRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_only)],
)
def create_entry(
    history_data: LicensePlateHistoryCreate,
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
):
    return verify_license_plate_history_access(
        session, LicensePlateHistory(**history_data.dict())
    )


@router.delete(
    "/{history_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(admin_only)],
)
def delete_entry(
    history_id: int,
    session: Session = Depends(get_session),
):
    history = get_license_plate_history_by_id(session, history_id)
    delete_license_plate_history(session, history)
