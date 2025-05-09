from datetime import datetime, timedelta
from random import choice, randint, uniform

from sqlmodel import Session, select

from core.security import get_password_hash
from db.models import Device, LicensePlateHistory, Location, User, UserDeviceLink


def seed_database(engine) -> None:
    with Session(engine) as session:
        super_admin = session.exec(select(User).where(User.username == "admin")).first()
        if not super_admin:
            super_admin = User(
                username="admin", password=get_password_hash("admin"), is_admin=True
            )
            session.add(super_admin)
            session.commit()

        users = [super_admin]
        for i in range(10):
            for is_admin in [True, False]:
                username = f"{'admin' if is_admin else 'user'}{i + 1}"
                existing_user = session.exec(
                    select(User).where(User.username == username)
                ).first()
                if not existing_user:
                    raw_password = "admin" if is_admin else "password"
                    user = User(
                        username=username,
                        password=get_password_hash(raw_password),
                        is_admin=is_admin,
                    )
                    session.add(user)
                    users.append(user)

        session.commit()

        devices = []
        for i in range(1, 6):
            hardware_id = f"device_{i}"
            device = session.exec(
                select(Device).where(Device.hardware_id == hardware_id)
            ).first()
            if not device:
                device = Device(hardware_id=hardware_id)
                session.add(device)
            devices.append(device)

        session.commit()

        for user in users:
            num_links = randint(1, 3)
            linked_device_ids = set()
            for _ in range(num_links):
                device = choice(devices)
                if device.id in linked_device_ids:
                    continue
                linked_device_ids.add(device.id)

                exists = session.exec(
                    select(UserDeviceLink).where(
                        UserDeviceLink.user_id == user.id,
                        UserDeviceLink.device_id == device.id,
                    )
                ).first()
                if not exists:
                    session.add(UserDeviceLink(user_id=user.id, device_id=device.id))
        session.commit()

        for device in devices:
            for _ in range(5):
                loc = Location(
                    device_id=device.id,
                    latitude=uniform(-90.0, 90.0),
                    longitude=uniform(-180.0, 180.0),
                    altitude=uniform(0, 100),
                    speed=uniform(0, 120),
                    timestamp=datetime.utcnow(),
                    date=datetime.utcnow().date(),
                )
                session.add(loc)
        session.commit()

        for device in devices:
            for i in range(2):
                start = datetime.utcnow() - timedelta(days=randint(10, 100))
                end = None if i == 0 else start + timedelta(days=randint(1, 9))
                plate = LicensePlateHistory(
                    device_id=device.id,
                    license_plate=f"PLATE{device.id}{i}",
                    start_date=start,
                    end_date=end,
                )
                session.add(plate)
        session.commit()

        print("database seeded successfully.")
