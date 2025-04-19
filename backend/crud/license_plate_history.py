from typing import List

from sqlmodel import Session, select

from db.models import LicensePlateHistory


def get_license_plate_history_by_id(
    session: Session, history_id: int
) -> LicensePlateHistory:
    return session.get(LicensePlateHistory, history_id)


def get_license_plate_histories_by_device(
    session: Session, device_id: int
) -> List[LicensePlateHistory]:
    return session.exec(
        select(LicensePlateHistory).where(LicensePlateHistory.device_id == device_id)
    ).all()


def create_license_plate_history(
    session: Session, history: LicensePlateHistory
) -> LicensePlateHistory:
    session.add(history)
    session.commit()
    session.refresh(history)
    return history


def delete_license_plate_history(
    session: Session, history: LicensePlateHistory
) -> None:
    session.delete(history)
    session.commit()
