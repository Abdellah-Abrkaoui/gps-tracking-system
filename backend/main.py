from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from api.v1.routers import routers
from config.openapi import custom_openapi
from db.database import engine
from seed import seed_users

app = FastAPI()
origins = ["*"]


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
    seed_users(engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.openapi = lambda: custom_openapi(app)


app.include_router(routers)
