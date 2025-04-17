from fastapi import APIRouter, Depends, status, HTTPException
from schemas.token import Token
from schemas.login import Login
from db.database import get_session
from fastapi.security import OAuth2PasswordRequestForm
from core.utils import authenticate_user, create_access_token, Session
from typing import Annotated

router = APIRouter()


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

    access_token = create_access_token({"sub": user.username, "is_admin": user.is_admin})
    return Token(access_token=access_token, token_type="bearer")
