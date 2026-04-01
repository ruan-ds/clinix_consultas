import pytest
from sqlalchemy import text
from app.core.database import engine

def test_database_connection():
    """
    Teste de Integração: Verifica se a aplicação consegue 
    conectar e executar um comando simples no MySQL (Docker).
    """
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            assert result.scalar() == 1
    except Exception as e:
        pytest.fail(f"A conexão com o banco de dados falhou: {e}")