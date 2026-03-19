import os

from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv


Base = declarative_base()



load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Criar a engine
# pool_pre_ping=True impede que o MySQL nao derrube conexões ociosas
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False # Bloqueia os SQL no terminal
)

# Cria a fabrica de sessões
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()