from datetime import datetime
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    password: str = Field(repr=False)
    is_admin: Optional[bool] = False

    user_device_links: List["UserDeviceLink"] = Relationship(
        back_populates="user", sa_relationship_kwargs={"cascade": "all, delete"}
    )

    @property
    def devices(self) -> List[int]:
        return [link.device_id for link in self.user_device_links]


class Device(SQLModel, table=True):
    __tablename__ = "devices"

    id: Optional[int] = Field(default=None, primary_key=True)
    hardware_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user_device_links: List["UserDeviceLink"] = Relationship(
        back_populates="device", sa_relationship_kwargs={"cascade": "all, delete"}
    )
    locations: List["Location"] = Relationship(
        back_populates="device", sa_relationship_kwargs={"cascade": "all, delete"}
    )
    license_plate_history: List["LicensePlateHistory"] = Relationship(
        back_populates="device", sa_relationship_kwargs={"cascade": "all, delete"}
    )


class UserDeviceLink(SQLModel, table=True):
    __tablename__ = "user_device_link"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", nullable=False)
    device_id: int = Field(foreign_key="devices.id", nullable=False)

    user: Optional[User] = Relationship(back_populates="user_device_links")
    device: Optional[Device] = Relationship(back_populates="user_device_links")


class Location(SQLModel, table=True):
    __tablename__ = "locations"

    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: int = Field(foreign_key="devices.id", nullable=False)
    latitude: float
    longitude: float
    altitude: float
    speed: float
    timestamp: Optional[datetime] = None
    date: Optional[datetime] = None
    received_at: datetime = Field(default_factory=datetime.utcnow)

    device: Optional[Device] = Relationship(back_populates="locations")


class LicensePlateHistory(SQLModel, table=True):
    __tablename__ = "license_plate_history"

    id: Optional[int] = Field(default=None, primary_key=True)
    device_id: int = Field(foreign_key="devices.id", nullable=False)
    license_plate: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    device: Optional[Device] = Relationship(back_populates="license_plate_history")
