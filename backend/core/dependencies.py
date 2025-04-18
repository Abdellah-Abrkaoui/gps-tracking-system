from annotated_types import Annotated
from fastapi import Depends, HTTPException, Path, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from core.security import decode_jwt_token, oauth2_scheme
from crud.user import get_user_by_id
from db.database import Session, get_session
from schemas.user import User


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Session = Depends(get_session),
) -> User:
    user_data = decode_jwt_token(token)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = get_user_by_id(session, user_data["id"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user


def verify_access(
    user_id: int = Path(...),
    token: str = Depends(oauth2_scheme),
) -> None:
    token = decode_jwt_token(token)
    if user_id != token["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")


def authentication_required(
    token: HTTPAuthorizationCredentials = Depends(HTTPBearer),
):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return token


def admin_only(user: User = Depends(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
