from fastapi import FastAPI
from db.database import engine
from sqlmodel import SQLModel
from api.v1 import router
from seed import seed_users

app = FastAPI()


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)
    seed_users(engine)


app.include_router(router)
