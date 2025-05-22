import Pyro4
from datetime import datetime
from sqlmodel import Session
from db.models import Location
from db.database import engine


@Pyro4.expose
class GpsService:
    def insert_location(self, device_id, lat, lon, alt, speed):
        with Session(engine) as session:
            location = Location(
                device_id=device_id,
                latitude=lat,
                longitude=lon,
                altitude=alt,
                speed=speed,
                timestamp=datetime.utcnow(),
                date=datetime.utcnow().date(),
            )
            session.add(location)
            session.commit()
        print(f"Inserted location for device {device_id}")


def main():
    daemon = Pyro4.Daemon(host="0.0.0.0", port=9090)
    uri = daemon.register(GpsService(), objectId="gps.service")
    print("GPS RPC server is ready. URI:", uri)
    daemon.requestLoop()


if __name__ == "__main__":
    main()
    