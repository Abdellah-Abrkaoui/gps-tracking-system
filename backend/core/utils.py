import jwt
from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from schemas.auth import Login
from db.models import User


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "3d4c35d5e90faede75526fc84eeb967b4b5b3b78c34e65780c36f6db9e9c9287" # TODO change in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(session: Session, user_login: Login) -> str:
    user = session.query(User).filter(User.username == user_login.username).first()

    if not user or not verify_password(user_login.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    jwt_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    jwt = create_access_token(
        data={"sub": user.username}, expires_delta=jwt_expires
    )

    return jwt
