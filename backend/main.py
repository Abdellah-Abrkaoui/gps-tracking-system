from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
import Pyro4

from sqlmodel import SQLModel
from api.v1.routers import routers
from config.openapi import custom_openapi
from db.database import engine
from seed import seed_database

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
    seed_database(engine)


gps_service = Pyro4.Proxy("PYRO:gps.service@localhost:9090")

@app.post("/rpc")
async def insert_location(data: dict):
    try:
        params = data["params"]
        gps_service.insert_location(
            device_id=params["device_id"],
            lat=params["latitude"],
            lon=params["longitude"],
            alt=params["altitude"],
            speed=params["speed"],
        )
        return {"jsonrpc": "2.0", "result": "ok", "id": data["id"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


app.include_router(routers)
add_pagination(app)
app.openapi = lambda: custom_openapi(app)
