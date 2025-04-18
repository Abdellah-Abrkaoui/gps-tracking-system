from fastapi import APIRouter, Depends, HTTPException, status

from core.security import authenticate_user, create_access_token
from db.database import Session, get_session
from schemas.login import Login
from schemas.token import Token

router = APIRouter(tags=["Authentication"])


@router.post("/auth")
def login_for_access_token(
    login_data: Login,
    session: Session = Depends(get_session),
) -> Token:
    user = authenticate_user(login_data.username, login_data.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        {"sub": user.username, "id": user.id, "is_admin": user.is_admin}
    )
    return Token(access_token=access_token, token_type="bearer")
