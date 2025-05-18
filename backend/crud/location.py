from sqlmodel import select

from db.models import Location, UserDeviceLink


def get_locations() -> select:
    return select(Location)


def get_locations_by_user_id(user_id: int) -> select:
    return (
        select(Location)
        .join(UserDeviceLink, Location.device_id == UserDeviceLink.device_id)
        .filter(UserDeviceLink.user_id == user_id)
    )
