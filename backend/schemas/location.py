from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class Location(BaseModel):
    device_id: int
    latitude: float
    longtitude: float
    altitude: float
    speed: float
    timestamp: Optional[datetime] = None
    date: Optional[datetime] = None

    class Config:
        orm_mode = True


class LocationRead(Location):
    id: int
    received_at: datetime

    class Config:
        orm_mode = True
