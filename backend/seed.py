from sqlmodel import Session
from db.models import User
from core.utils import get_password_hash


def seed_users(engine) -> None:
    users = [
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
            "devices": [0],
        },
    ]

    with Session(engine) as session:
        for user_data in users:
            if (
                not session.query(User)
                .filter(User.username == user_data["username"])
                .first()
            ):
                session.add(User(**user_data))

        session.commit()

    print("[✓] Users seeded")
