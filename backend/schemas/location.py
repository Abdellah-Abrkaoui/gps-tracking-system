from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class LocationRead(BaseModel):
    id: int
    received_at: datetime
    device_id: int
    latitude: float
    longitude: float
    altitude: float
    speed: float
    timestamp: Optional[datetime] = None
    date: Optional[datetime] = None

    class Config:
        from_attributes = True
