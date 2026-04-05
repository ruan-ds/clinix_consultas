## TIP 005 - Alembic

# Criar uma nova migração
- alembic revision --autogenerate -m "mensagem da migacao"

# Aplicar migração
- alembic upgrade head

# Reverter migração
- alembic downgrade -1
(-1 volta uma migração)

# Escolher banco de aplicação
- export DATABASE_URL="postgresql+psycopg://user:password@localhost:5432/example"