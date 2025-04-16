from fastapi import APIRouter, Depends, status, Response
from sqlmodel import Session
from db.database import get_session
from crud.auth import login
from schemas.auth import Login

router = APIRouter()

@router.post("/auth")
def login_user(login_data: Login , response: Response, session: Session = Depends(get_session)) -> dict:
    jwt = login(session, login_data)
    response.headers["Authorization"] = f"Bearer {jwt}"
    
    return {"detail": "login successful"}

