import Pyro4
import time
from random import uniform

def simulate_gps(device_id: int, interval=2):
    gps = Pyro4.Proxy("PYRO:gps.service@localhost:9090")
    while True:
        lat = uniform(-90, 90)
        lon = uniform(-180, 180)
        alt = uniform(0, 100)
        speed = uniform(0, 120)

        try:
            gps.insert_location(device_id, lat, lon, alt, speed)
            print(f"Sent location for device {device_id}")
        except Exception as e:
            print("RPC error:", e)

        time.sleep(interval)

if __name__ == "__main__":
    simulate_gps(device_id=1)

