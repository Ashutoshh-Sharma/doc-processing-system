from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# fallback for safety (prevents crash)
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"sslmode": "require"} if "postgresql" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()