from typing import Annotated

from fastapi import Depends, Path
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from core.security import decode_jwt_token, oauth2_scheme
from crud.device import get_devices_by_user_id
from crud.license_plate_history import get_license_plate_history_by_id
from crud.location import get_location_by_id, get_locations_by_user_id
from crud.user import get_user_by_id
from db.database import Session, get_session
from schemas.user import UserBase
from core.exceptions import NotFoundError, ForbiddenError, UnauthorizedError


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Session = Depends(get_session),
) -> UserBase:
    user_data = decode_jwt_token(token)
    if not user_data:
        raise UnauthorizedError(
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = get_user_by_id(session, user_data["id"])
    if not user:
        raise NotFoundError("User not found")

    return user


def verify_access(
    user_id: int = Path(...),
    token: str = Depends(oauth2_scheme),
) -> None:
    token = decode_jwt_token(token)
    if not token["is_admin"]:
        if user_id != token["id"]:
            raise ForbiddenError()


def verify_admin_modification_permissions(
    session: Session = Depends(get_session),
    user_id: int = Path(...),
    token: str = Depends(oauth2_scheme),
) -> None:
    token_data = decode_jwt_token(token)
    current_user_id = token_data["id"]

    # superadmin can modify themselves
    if current_user_id == 1 and user_id == 1:
        return

    target_user = get_user_by_id(session, user_id)

    # only superadmin can modify the superadmin
    if target_user.id == 1 and current_user_id != 1:
        raise ForbiddenError("Only Super Admin can modify the superadmin")

    # only superadmin can modify other admins
    if target_user.is_admin and current_user_id != 1:
        raise ForbiddenError("Only Super Admin can modify admins")


def verify_admin_deletion_permissions(
    session: Session = Depends(get_session),
    user_id: int = Path(...),
    token: str = Depends(oauth2_scheme),
) -> None:
    token_data = decode_jwt_token(token)
    current_user_id = token_data["id"]

    # superadmin can't delete themeselves
    if current_user_id == 1 and user_id == 1:
        raise ForbiddenError("Super admin can't delete themselves")

    target_user = get_user_by_id(session, user_id)

    # only superadmin can delete other admins
    if target_user.id == 1 and current_user_id != 1:
        raise ForbiddenError("Only Super Admin can delete admins")

    # only superadmin can delete other admins
    if target_user.is_admin and current_user_id != 1:
        raise ForbiddenError("Only Super Admin can delete admins")


def authentication_required(
    token: HTTPAuthorizationCredentials = Depends(HTTPBearer),
) -> None:
    if not token:
        raise UnauthorizedError(
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token


def admin_only(user: UserBase = Depends(get_current_user)) -> None:
    if not user.is_admin:
        raise ForbiddenError()


def verify_device_access(
    device_id: int = Path(...),
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> None:
    token_data = decode_jwt_token(token)
    user_id = token_data["id"]
    devices = get_devices_by_user_id(session, user_id)

    if not any(device.id == device_id for device in devices):
        raise UnauthorizedError()


def verify_location_access(
    location_id: int = Path(...),
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> None:
    token_data = decode_jwt_token(token)
    user_id = token_data["id"]

    location = get_location_by_id(session, location_id)
    if not location:
        raise NotFoundError("Location not found")

    user_locations = get_locations_by_user_id(session, user_id)

    if location.id not in {location.id for location in user_locations}:
        raise UnauthorizedError()


def verify_license_plate_history_access(
    history_id: int = Path(...),
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> None:
    token_data = decode_jwt_token(token)
    user_id = token_data["id"]

    history = get_license_plate_history_by_id(session, history_id)
    if not history:
        raise NotFoundError("License plate history not found")

    user_devices = get_devices_by_user_id(session, user_id)
    if history.device_id not in {device.id for device in user_devices}:
        raise UnauthorizedError()
