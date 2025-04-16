from typing import Optional, List
from sqlmodel import SQLModel

class User(SQLModel):
    username: str
    is_admin: Optional[bool] = False
    devices: Optional[List[int]] = None

class UserCreate(User):
    password: str

class UserRead(User):
    id: int

    class Config:
        from_attributes = True

class UserModify(SQLModel):
    username: Optional[str] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None
    devices: Optional[List[int]] = None

