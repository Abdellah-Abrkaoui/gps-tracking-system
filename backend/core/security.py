from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, OAuth2PasswordBearer

from crud.user import get_user_by_username
from db.database import Session, get_session
from schemas.user import UserBase
from core.exceptions import ForbiddenError

SECRET_KEY = "3d4c35d5e90faede75526fc84eeb967b4b5b3b78c34e65780c36f6db9e9c9287"  # TODO change in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
security = HTTPBearer()


def verify_password(password: str, hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hash.encode("utf-8"))


def get_password_hash(password: str) -> str:
    hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
    return hashed.decode("utf-8")


def create_access_token(data: dict) -> str:
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_jwt_token(token_to_validate: str) -> dict | None:
    try:
        decoded_payload = jwt.decode(
            token_to_validate, SECRET_KEY, algorithms=ALGORITHM
        )
        return decoded_payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token has expired. Please log in again",
        )
    except jwt.InvalidTokenError:
        raise ForbiddenError()
    return None


def authenticate_user(
    username: str, password: str, session: Session = Depends(get_session)
) -> UserBase:
    user = get_user_by_username(session, username)

    if not user or not verify_password(password, user.password):
        return False

    return user
