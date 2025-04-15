from sqlmodel import SQLModel
from typing import Optional

class UserCreate(SQLModel):
    username: str
    password: str
    is_admin: Optional[bool] = False
    devices: Optional[list[int]] = None

class UserRead(SQLModel):
    id: int
    username: str
    is_admin: Optional[bool] = False
    devices: Optional[list[int]] = None

class UserModify(SQLModel):
    username: str
    is_admin: Optional[bool] = False
    devices: Optional[list[int]] = None
