from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_pagination import paginate, LimitOffsetPage

from core.dependencies import (
    admin_only,
    authentication_required,
    verify_admin_deletion_permissions,
    verify_admin_modification_permissions,
)
from core.exceptions import NotFoundError
from crud.user import (
    create_user,
    delete_user,
    get_user_by_id,
    get_user_by_username,
    get_users,
    update_user,
)
from db.database import Session, get_session
from schemas.user import UserCreate, UserModify, UserRead

router = APIRouter(
    prefix="/users",
    tags=["User Management"],
    dependencies=[Depends(authentication_required)],
)


@router.get("", response_model=LimitOffsetPage[UserRead], dependencies=[Depends(admin_only)])
def read_users(session: Session = Depends(get_session)):
    return paginate(get_users(session))


@router.post(
    "",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(admin_only)],
)
def add_user(
    user: UserCreate,
    session: Session = Depends(get_session),
):
    existing_user = get_user_by_username(session, user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
        )
    return create_user(session, user)


@router.patch(
    "/{user_id}",
    response_model=UserRead,
    dependencies=[Depends(admin_only), Depends(verify_admin_modification_permissions)],
)
def modify_user(
    user_id: int,
    user_update: UserModify,
    session: Session = Depends(get_session),
):
    user = get_user_by_id(session, user_id)
    if not user:
        raise NotFoundError("User not found")

    return update_user(session, user, user_update)


@router.delete(
    "/{user_id}",
    response_model=dict,
    dependencies=[
        Depends(admin_only),
        Depends(verify_admin_deletion_permissions),
    ],
)
def delete_user_by_id(
    user_id: int,
    session: Session = Depends(get_session),
):
    user = get_user_by_id(session, user_id)
    if not user:
        raise NotFoundError("User not found")

    return delete_user(session, user)
