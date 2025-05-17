from typing import List

from sqlmodel import Session, select

from db.models import Location, UserDeviceLink


def get_locations(session: Session) -> list[Location]:
    return select(Location)


def get_locations_by_user_id(session: Session, user_id: int) -> List[Location]:
    return (
        session.query(Location)
        .join(UserDeviceLink, Location.device_id == UserDeviceLink.device_id)
        .filter(UserDeviceLink.user_id == user_id)
        .all()
    )
