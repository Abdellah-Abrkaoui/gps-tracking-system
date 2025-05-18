from sqlmodel import select

from db.models import Device, LicensePlateHistory, UserDeviceLink


def get_license_plate_history_by_user_id(user_id: int) -> select:
    return (
        select(LicensePlateHistory)
        .join(Device)
        .join(UserDeviceLink)
        .where(UserDeviceLink.user_id == user_id)
    )


def get_license_plate_history() -> select:
    return select(LicensePlateHistory)
