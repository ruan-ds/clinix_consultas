## TIP 005 - Alembic

# Criar uma nova migração
- alembic revision --autogenerate -m "mensagem da migacao"

# Aplicar migração
- alembic upgrade head

# Reverter migração
- alembic downgrade -1
(-1 volta uma migração)