from sqlmodel import SQLModel, Field, JSON, Column
from typing import Optional
from datetime import datetime

#
# TODO: add relationships
#


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str
    is_admin: Optional[bool] = False
    devices: list[int] | None = Field(default=None, sa_column=Column(JSON))


class Device(SQLModel, table=True):
    __tablename__ = "devices"

    id: Optional[int] = Field(default=None, primary_key=True)
    hardware_id: int
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserDeviceLink(SQLModel, table=True):
    __tablename__ = "user_device_link"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    device_id: int = Field(foreign_key="devices.id")


class Location(SQLModel, table=True):
    __tablename__ = "locations"

    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: int = Field(foreign_key="devices.id")
    latitude: float
    longtitude: float
    altitude: float
    speed: float
    timestamp: Optional[datetime] = None
    date: Optional[datetime] = None

    received_at: datetime = Field(default_factory=datetime.utcnow)


class LicensePlateHistory(SQLModel, table=True):
    __tablename__ = "license_plate_history"

    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: int = Field(foreign_key="devices.id")
    license_plate: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
