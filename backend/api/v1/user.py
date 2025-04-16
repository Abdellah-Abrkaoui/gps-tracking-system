from fastapi import APIRouter, Depends, status
from sqlmodel import Session
from db.database import get_session
from crud.user import get_users, create_user, get_user_by_id, delete_user, update_user
from schemas.user import UserCreate, UserRead, UserModify

router = APIRouter()

@router.get("/users/{user_id}", response_model=UserRead)
def read_user(user_id: int, session: Session = Depends(get_session)):
    return get_user_by_id(session, user_id)

@router.get("/users", response_model=list[UserRead])
def read_users(session: Session = Depends(get_session)):
    return get_users(session)

@router.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def add_user(user: UserCreate, session: Session = Depends(get_session)):
    return create_user(session, user)

@router.patch("/users/{user_id}", response_model=UserRead)
def modify_user(user_id: int, user_update: UserModify, session: Session = Depends(get_session)):
    return update_user(session=session, user_id=user_id, user_update=user_update)

@router.delete("/users/{user_id}", response_model=dict)
def delete_user_by_id(user_id: int, session: Session = Depends(get_session)):
    return delete_user(session=session, user_id=user_id)
