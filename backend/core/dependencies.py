from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from core.utils import get_current_user
from schemas.user import User

security = HTTPBearer(auto_error=False)


def authentication_required(
    token: HTTPAuthorizationCredentials = Depends(security),
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
