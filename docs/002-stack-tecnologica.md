
# ADR 002 - Definição das tecnologias

## Status
Definido

## Contexto
Precisavamos de um backend, um frontend, um banco de dados, uma ORM, um sistema de migrations e um sistema de versionamento.

## Decisão
- backend - Python, FastAPI
- frontend - HTML, CSS, React, TypeScript
- banco de dados - PostgreSQL
- ORM - SQLAlchemy
- migrations - Alembic
- formatação/linting (Backend) - Black, Ruff
- formatação/linting (Frontend) - Prettier, ESLint
- prototipação e design - Figma

## Consequências
- Garantir padronização em todos os ambientes de desenvolvimento
- Facilidade na identificação de erros
- Facilidade na manutenção do ambiente dev