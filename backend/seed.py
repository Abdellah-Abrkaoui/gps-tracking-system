from datetime import datetime, timedelta
from random import randint, uniform

from sqlmodel import Session

from core.security import get_password_hash
from db.models import (
    Device,
    LicensePlateHistory,
    Location,
    User,
    UserDeviceLink,
)


def seed_database(engine) -> None:
    with Session(engine) as session:
        User.metadata.drop_all(engine)
        Device.metadata.drop_all(engine)
        UserDeviceLink.metadata.drop_all(engine)
        Location.metadata.drop_all(engine)
        LicensePlateHistory.metadata.drop_all(engine)

        User.metadata.create_all(engine)
        Device.metadata.create_all(engine)
        UserDeviceLink.metadata.create_all(engine)
        Location.metadata.create_all(engine)
        LicensePlateHistory.metadata.create_all(engine)
        users_data = [
            {
                "username": "admin",
                "password": get_password_hash("admin"),
                "is_admin": True,
                "devices": [],
            },
            {
                "username": "user1",
                "password": get_password_hash("password"),
                "is_admin": False,
                "devices": [1],
            },
        ]

        users = []
        for user_data in users_data:
            user = (
                session.query(User)
                .filter(User.username == user_data["username"])
                .first()
            )
            if not user:
                user = User(**user_data)
                session.add(user)
            users.append(user)

        session.commit()

        devices_data = [
            {"id": 1, "hardware_id": 1010101},
            {"id": 2, "hardware_id": 2020202},
            {"id": 3, "hardware_id": 3030303},
        ]

        devices = []
        for dev_data in devices_data:
            device = session.get(Device, dev_data["id"])
            if not device:
                device = Device(**dev_data)
                session.add(device)
            devices.append(device)

        session.commit()

        links_data = [
            {"user_id": users[1].id, "device_id": devices[0].id},
        ]

        for link_data in links_data:
            exists = (
                session.query(UserDeviceLink)
                .filter_by(
                    user_id=link_data["user_id"], device_id=link_data["device_id"]
                )
                .first()
            )
            if not exists:
                session.add(UserDeviceLink(**link_data))

        session.commit()

        for device in devices:
            for _ in range(3):
                location = Location(
                    device_id=device.id,
                    latitude=uniform(-90.0, 90.0),
                    longtitude=uniform(-180.0, 180.0),
                    altitude=uniform(0, 100),
                    speed=uniform(0, 120),
                    timestamp=datetime.utcnow(),
                    date=datetime.utcnow().date(),
                )
                session.add(location)

        license_plate_data = [
            {
                "device_id": device.id,
                "license_plate": f"PLATE{device.id}{i}",
                "start_date": datetime.utcnow() - timedelta(days=randint(10, 100)),
                "end_date": None
                if i == 0
                else datetime.utcnow() - timedelta(days=randint(1, 9)),
            }
            for device in devices
            for i in range(2)
        ]

        for lp in license_plate_data:
            session.add(LicensePlateHistory(**lp))

        session.commit()

        print("Database seeded successfully")
