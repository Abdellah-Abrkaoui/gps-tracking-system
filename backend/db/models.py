from sqlmodel import SQLModel, Field, JSON, Column
from typing import Optional
from datetime import datetime

#
# TODO: add relationships
#

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str
    is_admin: Optional[bool] = False
    devices: list[int] | None = Field(default=None, sa_column=Column(JSON))

class Device(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hardware_id: int
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserDeviceLink(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    device_id: int = Field(foreign_key="device.id")

class Location(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: int = Field(foreign_key="device.id")
    latitude: float
    longtitude: float
    altitude: float
    speed: float
    timestamp: Optional[datetime] = None
    date: Optional[datetime] = None

    received_at: datetime = Field(default_factory=datetime.utcnow)


class LicensePlateHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: int = Field(foreign_key="device.id")
    license_plate: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

