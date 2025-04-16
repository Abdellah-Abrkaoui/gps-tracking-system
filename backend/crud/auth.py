from sqlalchemy.orm import Session
from db.models import User
from schemas.auth import Login
from fastapi import HTTPException, status
from core.utils import authenticate_user

def login(session: Session, user_login: Login) -> dict:
    return authenticate_user(session, user_login)

