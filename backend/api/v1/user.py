from fastapi import APIRouter, Depends
from sqlmodel import Session
from db.database import get_session
from crud.user import get_users, create_user
from schemas.user import UserCreate, UserRead

router = APIRouter()

@router.get("/users", response_model=list[UserRead])
def read_users(session: Session = Depends(get_session)):
    return get_users(session)

@router.post("/users", response_model=UserRead)
def add_user(user: UserCreate, session: Session = Depends(get_session)):
    return create_user(session, user)

