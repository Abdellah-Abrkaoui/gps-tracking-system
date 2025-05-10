from typing import List

from sqlmodel import Session, select

from db.models import Device, LicensePlateHistory, UserDeviceLink
from schemas.license_plate_history import LicensePlateHistoryRead


def get_license_plate_history_by_id(
    session: Session, history_id: int
) -> LicensePlateHistory:
    return session.get(LicensePlateHistory, history_id)


def get_license_plate_history_by_user_id(
    session: Session, user_id: int
) -> List[LicensePlateHistory]:
    license_plate_histories = session.exec(
        select(LicensePlateHistory)
        .join(Device)
        .join(UserDeviceLink)
        .where(UserDeviceLink.user_id == user_id)
    ).all()

    return license_plate_histories


def get_license_plate_history(session: Session) -> list[LicensePlateHistoryRead]:
    return session.query(LicensePlateHistory).all()
