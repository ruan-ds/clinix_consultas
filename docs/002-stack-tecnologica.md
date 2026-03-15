
# ADR 002 - Definição das tecnologias

## Status
Definido

## Contexto
Precisavamos de um backend, um frontend, um banco de dados, uma ORM, um sistema de migrations e um sistema de versionamento.

## Decisão
- backend - Python, FastAPI
- frontend - HTML, CSS, React
- banco de dados - MySQL
- ORM - SQLAlchemy
- migrations - Alembic
- versionamento - Git, Black, Flake8

## Consequências
- Garantir padronização em todos os ambientes de desenvolvimento
- Facilidade na identificação de erros
- Facilidade na manutenção do ambiente dev