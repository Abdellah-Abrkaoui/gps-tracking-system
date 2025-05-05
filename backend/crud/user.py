from sqlmodel import Session, select

from fastapi import HTTPException, status

from db.models import Device, User, UserDeviceLink
from schemas.user import UserCreate, UserModify, UserRead


def get_user_by_id(session: Session, user_id: int) -> User | None:
    return session.get(User, user_id)


def get_user_by_username(session: Session, username: str) -> User | None:
    return session.query(User).filter(User.username == username).first()


def get_users(session: Session) -> list[User]:
    return session.query(User).all()


def create_user(session: Session, user_data: UserCreate) -> UserRead:
    from core.security import get_password_hash

    user = User(
        username=user_data.username,
        password=get_password_hash(user_data.password),
        is_admin=user_data.is_admin,
    )
    session.add(user)

    device_ids = user_data.devices or []

    if device_ids:
        devices = session.exec(select(Device).where(Device.id.in_(device_ids))).all()

        found_ids = {device.id for device in devices}
        missing_ids = set(device_ids) - found_ids

        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Devices not found: {missing_ids}",
            )

        session.add_all(
            [UserDeviceLink(user=user, device_id=device_id) for device_id in device_ids]
        )

    session.commit()
    session.refresh(user)

    return UserRead(
        id=user.id,
        username=user.username,
        is_admin=user.is_admin,
        devices=device_ids,
    )


def update_user(session: Session, user: User, update_data: UserModify) -> UserRead:
    from core.security import get_password_hash

    if update_data.password:
        update_data.password = get_password_hash(update_data.password)

    user_data = update_data.model_dump(exclude_unset=True, exclude={"devices"})
    user.sqlmodel_update(user_data)

    if update_data.devices is not None:
        device_ids = update_data.devices

        devices = session.exec(select(Device).where(Device.id.in_(device_ids))).all()
        found_ids = {device.id for device in devices}
        missing_ids = set(device_ids) - found_ids

        if missing_ids:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Devices not found: {sorted(missing_ids)}",
            )

        existing_links = session.exec(
            select(UserDeviceLink).where(UserDeviceLink.user_id == user.id)
        ).all()
        for link in existing_links:
            session.delete(link)

        new_links = [
            UserDeviceLink(user_id=user.id, device_id=device_id)
            for device_id in device_ids
        ]
        session.add_all(new_links)

    session.add(user)
    session.commit()
    session.refresh(user)

    return UserRead(
        id=user.id,
        username=user.username,
        is_admin=user.is_admin,
        devices=update_data.devices or [],
    )


def delete_user(session: Session, user: User) -> dict:
    session.delete(user)
    session.commit()

    return {"detail": "User deleted successfully"}
