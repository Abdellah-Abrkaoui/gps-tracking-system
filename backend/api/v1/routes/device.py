from fastapi import APIRouter, Depends, status
from fastapi_pagination import LimitOffsetPage
from fastapi_pagination.ext.sqlmodel import paginate

from core.dependencies import (
    admin_only,
    authentication_required,
    decode_jwt_token,
    oauth2_scheme,
)
from core.exceptions import NotFoundError
from crud.device import (
    create_device,
    delete_device,
    get_device_by_hardware_id,
    get_device_by_id,
    get_devices,
    get_devices_by_user_id,
    update_device,
)
from db.database import Session, get_session
from schemas.device import DeviceCreate, DeviceModify, DeviceRead

router = APIRouter(
    prefix="/devices",
    tags=["Device Management"],
    dependencies=[Depends(authentication_required)],
)


@router.get("", response_model=LimitOffsetPage[DeviceRead])
def read_devices(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
):
    token = decode_jwt_token(token)

    if token.get("is_admin"):
        devices = get_devices(session)
    else:
        devices = get_devices_by_user_id(token["id"])

    if devices is None:
        raise NotFoundError("No devices found")

    return paginate(session, devices)


@router.post(
    "",
    response_model=DeviceRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_only)],
)
def add_device(
    device: DeviceCreate,
    session: Session = Depends(get_session),
):
    existing_device = get_device_by_hardware_id(session, device.hardware_id)
    if existing_device:
        raise NotFoundError("Device with such hardware id already exists")

    return create_device(session, device)


@router.patch(
    "/{device_id}",
    response_model=DeviceRead,
    dependencies=[Depends(admin_only)],
)
def modify_device(
    device_id: int,
    device_update: DeviceModify,
    session: Session = Depends(get_session),
):
    device = get_device_by_id(session, device_id)
    if not device:
        raise NotFoundError("Device not found")

    return update_device(session, device, device_update)


@router.delete(
    "/{device_id}",
    response_model=dict,
    dependencies=[
        Depends(admin_only),
    ],
)
def delete_device_by_id(
    device_id: int,
    session: Session = Depends(get_session),
):
    device = get_device_by_id(session, device_id)
    if not device:
        raise NotFoundError("Device not found")

    return delete_device(session, device)
