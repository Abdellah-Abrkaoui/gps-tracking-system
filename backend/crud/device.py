from sqlmodel import Session, select

from db.models import Device, UserDeviceLink
from schemas.device import DeviceCreate, DeviceModify, DeviceRead


def get_device_by_id(session: Session, device_id: int) -> Device | None:
    return session.get(Device, device_id)


def get_device_by_hardware_id(session: Session, hardware_id: str) -> Device | None:
    return session.query(Device).filter(Device.hardware_id == hardware_id).first()


def get_devices() -> select:
    return select(Device)


def get_devices_by_user_id(user_id: int) -> select:
    return (
        select(Device)
        .join(UserDeviceLink, UserDeviceLink.device_id == Device.id)
        .where(UserDeviceLink.user_id == user_id)
    )


def create_device(session: Session, device: DeviceCreate) -> DeviceRead | None:
    db_device = Device(hardware_id=device.hardware_id)

    session.add(db_device)
    session.commit()
    session.refresh(db_device)

    return DeviceRead.from_orm(db_device)


def update_device(
    session: Session, device: Device, device_update_data: DeviceModify
) -> Device:
    device_data = device_update_data.model_dump(exclude_unset=True)
    device.sqlmodel_update(device_data)
    session.add(device)
    session.commit()
    session.refresh(device)

    return device


def delete_device(session: Session, device: Device) -> dict:
    session.delete(device)
    session.commit()

    return {"detail": "Device deleted successfully"}
