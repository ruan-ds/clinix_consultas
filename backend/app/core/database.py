from sqlalchemy import create_engine, MetaData

from sqlalchemy.orm import sessionmaker, DeclarativeBase

from dotenv import load_dotenv

import os


POSTGRES_NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",  
    "uq": "uq_%(table_name)s_%(column_0_name)s",  
    "ck": "ck_%(table_name)s_%(constraint_name)s",  
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",  
    "pk": "pk_%(table_name)s"
}


metadata = MetaData(naming_convention=POSTGRES_NAMING_CONVENTION)


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Criar a engine
# pool_pre_ping=True garante que a conexão não seja fechada pelo PostgreSQL por inatividade
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False # Bloqueia os SQL no terminal
)

# Cria a fabrica de sessões
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()