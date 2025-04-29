from sqlmodel import Session

from fastapi import HTTPException, status

from db.models import Device, User, UserDeviceLink
from schemas.user import UserCreate, UserModify, UserRead


def get_user_by_id(session: Session, user_id: int) -> User | None:
    return session.get(User, user_id)


def get_user_by_username(session: Session, username: str) -> User | None:
    return session.query(User).filter(User.username == username).first()


def get_users(session: Session) -> list[User]:
    return session.query(User).all()


def create_user(session: Session, user: UserCreate) -> UserRead | None:
    from core.security import get_password_hash

    hashed_password = get_password_hash(user.password)

    db_user = User(
        username=user.username,
        password=hashed_password,
        is_admin=user.is_admin,
        devices=user.devices,
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    return UserRead.from_orm(db_user)


def update_user(session: Session, user: User, user_update_data: UserModify) -> User:
    from core.security import get_password_hash

    if user_update_data.password:
        user_update_data.password = get_password_hash(user_update_data.password)

    user_data = user_update_data.model_dump(exclude_unset=True)

    user.sqlmodel_update(user_data)

    # handle device updates
    if user_update_data.devices is not None:
        # first clear the existing user-device links
        existing_device_links = (
            session.query(UserDeviceLink)
            .filter(UserDeviceLink.user_id == user.id)
            .all()
        )
        for link in existing_device_links:
            session.delete(link)

        # now we add the new device links based on the provided device IDs
        for device_id in user_update_data.devices:
            # check if the device exists
            device = session.query(Device).filter(Device.id == device_id).first()
            if not device:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Device with id {device_id} not found.",
                )

            # create and add a new UserDeviceLink entry
            new_link = UserDeviceLink(user_id=user.id, device_id=device_id)
            session.add(new_link)

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def delete_user(session: Session, user: User) -> dict:
    session.delete(user)
    session.commit()

    return {"detail": "User deleted successfully"}
