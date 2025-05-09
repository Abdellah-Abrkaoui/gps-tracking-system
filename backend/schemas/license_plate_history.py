from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class LicensePlateHistoryBase(BaseModel):
    device_id: int
    license_plate: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class LicensePlateHistoryRead(LicensePlateHistoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
