from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Device(BaseModel):
    hardware_id: str
    created_at: datetime


class DeviceCreate(Device):
    hardware_id: Optional[str]


class DeviceModify(Device):
    pass


class DeviceRead(BaseModel):
    id: int
