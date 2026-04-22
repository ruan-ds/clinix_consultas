from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv

from app.core.database import get_db
from app.core.base_model import Base
from app import models # noqa: F401
from app.main import app as real_app

from fastapi.testclient import TestClient

import pytest
import os


load_dotenv()

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")

if not TEST_DATABASE_URL:
    raise ValueError("TEST_DATABASE_URL não foi definido no .env")

@pytest.fixture(scope="session")
def engine():
    engine = create_engine(TEST_DATABASE_URL,  echo=False)

    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    yield engine

    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(engine):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionLocal()

    yield session

    session.rollback()
    session.close()

@pytest.fixture
def test_app(db_session):
    real_app.dependency_overrides[get_db] = lambda: db_session
    yield real_app
    real_app.dependency_overrides.clear()

@pytest.fixture
def client(test_app):
    return TestClient(test_app)