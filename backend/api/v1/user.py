from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session
from db.database import get_session
from crud.user import get_users, create_user, get_user_by_id, delete_user, update_user
from core.utils import get_user_by_username
from schemas.user import UserCreate, UserRead, UserModify

router = APIRouter()

@router.get("/users/{user_id}", response_model=UserRead)
def read_user(user_id: int, session: Session = Depends(get_session)):
    user =  get_user_by_id(session, user_id)    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

@router.get("/users", response_model=list[UserRead])
def read_users(session: Session = Depends(get_session)):
    return get_users(session)

@router.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def add_user(user: UserCreate, session: Session = Depends(get_session)):
    existing_user = get_user_by_username(session, user.username)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    return create_user(session, user)


@router.patch("/users/{user_id}", response_model=UserRead)
def modify_user(user_id: int, user_update: UserModify, session: Session = Depends(get_session)):
    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return update_user(session, user, user_update)


@router.delete("/users/{user_id}", response_model=dict)
def delete_user_by_id(user_id: int, session: Session = Depends(get_session)):
    user = get_user_by_id(session, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return delete_user(session, user)
