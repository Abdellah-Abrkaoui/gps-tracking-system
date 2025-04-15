from fastapi import FastAPI
from db.database import engine
from db.models import SQLModel
from api.v1 import router

app = FastAPI()

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

app.include_router(router)

