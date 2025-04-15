from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "postgresql+psycopg2://postgres:postgres@db:5432/postgres"

engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

