from typing import Optional, List
from pydantic import BaseModel

class User(BaseModel):
    username: str
    is_admin: Optional[bool] = False
    devices: Optional[List[int]] = None

class UserCreate(User):
    password: str

class UserRead(User):
    id: int

class UserModify(User):
    username: Optional[str] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None
    devices: Optional[List[int]] = None

