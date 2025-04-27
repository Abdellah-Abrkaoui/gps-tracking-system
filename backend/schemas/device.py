from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class DeviceBase(BaseModel):
    hardware_id: str
    created_at: datetime


class DeviceCreate(DeviceBase):
    hardware_id: Optional[str]


class DeviceModify(DeviceBase):
    pass


class DeviceRead(DeviceBase):
    id: int
