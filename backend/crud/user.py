from sqlmodel import Session, select
from fastapi import HTTPException, status
from db.models import User
from schemas.user import UserCreate, UserModify
from core.utils import get_password_hash

def get_user_by_id(session: Session, user_id: int) -> User:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user

def get_users(session: Session) -> list[User]:
    return session.query(User).all()

def create_user(session: Session, user: UserCreate) -> User:
    existing_user = session.exec(select(User).where(User.username == user.username)).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    hashed_password = get_password_hash(user.password)
    db_user = User(**user.dict(), password=hashed_password)  
    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return db_user 

def update_user(session: Session, user_id: int, user_update: UserModify) -> User:
    user = get_user_by_id(session, user_id)

    if user_update.username:
        user.username = user_update.username

    if user_update.password:
        user.password = get_password_hash(user_update.password)

    session.commit()
    session.refresh(user)
    
    return user

def delete_user(session: Session, user_id: int) -> dict:
    user = get_user_by_id(session, user_id)

    session.delete(user)
    session.commit()
    
    return {"detail": "User deleted successfully"}
