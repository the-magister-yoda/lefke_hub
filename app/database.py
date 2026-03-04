from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker, declarative_base


DATABASE_URL = "postgresql+psycopg2://myuser:1234@localhost:5432/lefke_hub"
engine = create_engine(DATABASE_URL)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
