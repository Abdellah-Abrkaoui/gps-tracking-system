from sqlmodel import Session, select
from fastapi import HTTPException
from db.models import User
from schemas.user import UserCreate

def get_users(session: Session):
    return session.query(User).all()

def create_user(session: Session, user: UserCreate):
    existing_user = session.exec(select(User).where(User.username == user.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    db_user = User(**user.dict())
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user