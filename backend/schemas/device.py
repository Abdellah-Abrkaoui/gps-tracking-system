from datetime import datetime

from pydantic import BaseModel


class DeviceBase(BaseModel):
    hardware_id: str


class DeviceCreate(DeviceBase):
    pass


class DeviceModify(DeviceBase):
    pass


class DeviceRead(DeviceBase):
    id: int
    created_at: datetime
