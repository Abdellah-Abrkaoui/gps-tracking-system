from typing import Optional

from pydantic import BaseModel


class UserDeviceLink(BaseModel):
    id: Optional[int]  # Optional, meaning it can be None
    user_id: int
    device_id: int
