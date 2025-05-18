from typing import Annotated

from fastapi import Depends, Path
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from core.exceptions import ForbiddenError, NotFoundError, UnauthorizedError
from core.security import decode_jwt_token, oauth2_scheme
from crud.user import get_user_by_id
from db.database import Session, get_session
from schemas.user import UserBase


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
