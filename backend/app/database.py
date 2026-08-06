from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import DATABASE_URL

# create_engine is configured for SQLAlchemy 2.0 style
engine = create_engine(DATABASE_URL, future=True, pool_pre_ping=True)

# sessionmaker in SQLAlchemy 2.x does not accept `autocommit`.
# use `future=True` to opt into 2.0 behavior and control autoflush/expire_on_commit as needed
SessionLocal = sessionmaker(bind=engine, autoflush=False, future=True)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
