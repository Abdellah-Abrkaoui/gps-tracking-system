from sqlmodel import SQLModel
from typing import Optional

class UserBase(SQLModel):
    username: str
    is_admin: Optional[bool] = False
    devices: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserRead(UserBase):
    id: int
