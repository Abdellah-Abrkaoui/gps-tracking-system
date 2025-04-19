from typing import List

from sqlmodel import Session

from db.models import Location
from schemas.user_device_link import UserDeviceLink


def get_location_by_id(session: Session, location_id: int) -> Location | None:
    return session.get(Location, location_id)


def get_locations(session: Session) -> list[Location]:
    return session.query(Location).all()


def get_locations_by_user_id(session: Session, user_id: int) -> List[Location]:
    return (
        session.query(Location)
        .join(UserDeviceLink, Location.device_id == UserDeviceLink.device_id)
        .filter(UserDeviceLink.user_id == user_id)
        .all()
    )


def delete_location(session: Session, location: Location) -> dict:
    session.delete(location)
    session.commit()

    return {"detail": "Location deleted successfully"}
