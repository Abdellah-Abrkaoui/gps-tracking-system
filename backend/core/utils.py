import jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends, Path
from fastapi.security import OAuth2PasswordBearer
from db.models import User
from db.database import get_session, Session
from schemas.token import TokenData
from typing import Annotated

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "3d4c35d5e90faede75526fc84eeb967b4b5b3b78c34e65780c36f6db9e9c9287"  # TODO change in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def get_user_by_id(session: Session, user_id: int) -> User | None:
    return session.get(User, user_id)


def get_user_by_username(session: Session, username: str) -> User | None:
    return session.query(User).filter(User.username == username).first()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


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
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid token"
        )

    return None


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: Session = Depends(get_session),
) -> TokenData:
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
    return TokenData(
        username=user.username,
        role=user.is_admin,
        user_id=user.id,
        is_admin=user.is_admin,
    )


def authenticate_user(
    username: str, password: str, session: Session = Depends(get_session)
) -> User:
    user = get_user_by_username(session, username)

    if not user or not verify_password(password, user.password):
        return False

    return user


def verify_access(
    user_id: int = Path(),
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> bool:
    current_user = get_current_user(token, session)

    if user_id:
        if current_user.is_admin is False and current_user.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden"
            )

    return True
