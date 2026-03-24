# Clinix Backend

Este diretório contém o backend da plataforma Clinix.

A API foi construída com FastAPI, utilizando PostgreSQL como banco relacional, SQLAlchemy como ORM e Alembic para migrations.

Este README foca no contexto técnico do backend: estrutura, execução local, banco, testes e convenções de desenvolvimento.

---

## Stack Tecnológica

- **FastAPI**
- **PostgreSQL**
- **Pydantic (contratos)**
- **SQLAlchemy (ORM)**
- **Alembic (migrations)**
- **Poetry (gerenciamento de dependências)**
- **Pytest (testes unitários e de integração)**
- **Docker (ambiente de banco em desenvolvimento)**

---

## Arquitetura

O backend segue uma organização em camadas para separar responsabilidades entre entrega HTTP, contratos, persistência, regras de negócio e infraestrutura.

- `api/` — rotas e dependências
- `schemas/` — contratos Pydantic
- `models/` — persistência com SQLAlchemy
- `services/` — regras de domínio
- `core/` — configuração, segurança, RBAC e banco

---

## Estrutura do Backend

Pasta raiz do backend:

```text
backend/
  pyproject.toml        -> dependências e metadata (Poetry)
  poetry.lock           -> lockfile (reprodutibilidade)
  README.md             -> instruções e detalhes específicos do backend
  app/                  -> código fonte (API, core, modelos, serviços)
  alembic.ini           -> config principal do Alembic
  alembic/              -> diretório de migrations (versions/)
  tests/                -> testes (pytest)
```

Estrutura interna:

```text
backend/app/
  main.py               -> entrypoint da aplicação FastAPI
  core/                 -> configurações e infraestrutura transversal
  api/                  -> rotas e dependências (versionadas em v1/)
  models/               -> modelos/tabelas SQLAlchemy
  schemas/              -> contratos Pydantic (request/response)
  services/             -> regras de negócio (domínio)
```

---

## Controle de Acesso (RBAC)

O sistema utiliza **Role-Based Access Control** implementado no back-end para garantir a governança dos dados e a segurança do fluxo operacional entre os diferentes perfis de usuário:

- **Paciente:** Solicitação e acompanhamento de agendamentos.
- **Funcionário da Clínica:** Gestão da agenda local e operações de rotina (confirmação/no-show).
- **Operador Clinix (BPO):** Gestão multi-clínica, padronização e rastreabilidade do fluxo.

> A autorização é validada integralmente na API; o front-end atua como uma camada de interface que reflete as permissões do perfil autenticado.

---

## Multi-clínica (tenant)

Como o Clinix atende várias clínicas, as entidades principais carregam `clinic_id`.

Estratégia MVP (isolamento lógico):
- Tabelas com coluna `clinic_id`.
- Queries sempre filtradas por `clinic_id` conforme o usuário autenticado.
- Operador Clinix pode ter escopo multi-clínica; staff da clínica só pode ver sua clínica.

Implementação típica:
- `deps.py` — `get_current_user` + `tenant_scope`
- `services/` — garantir que mudanças respeitam o escopo

---

## Docker + PostgreSQL (desenvolvimento)

O Docker é utilizado para subir o PostgreSQL em desenvolvimento, enquanto o backend roda localmente via Poetry.

Na raiz do repositório existe um `docker-compose.yml` com o serviço do banco.

Subir o banco:

```bash
docker compose up -d
```

Derrubar:

```bash
docker compose down
```

---

## SQLAlchemy + Alembic (migrations)

O SQLAlchemy declara os modelos em `app/models/`. O Alembic versiona e aplica mudanças no schema do banco.

Fluxo típico:

1. Alterar ou criar modelos em `app/models/`.
2. Gerar migration:
   ```bash
   poetry run alembic revision --autogenerate -m "mensagem"
   ```
3. Aplicar migrations:
   ```bash
   poetry run alembic upgrade head
   ```
4. Commitar o arquivo gerado em `alembic/versions/`.

> Migrations devem ser revisadas antes do commit. Migration não é sinônimo de model.

---

## Execução local (Poetry)

1. Entrar na pasta do backend:
   ```bash
   cd backend
   ```
2. Instalar dependências:
   ```bash
   poetry install
   ```
3. Aplicar migrations:
   ```bash
   poetry run alembic upgrade head
   ```
4. Rodar a API:
   ```bash
   poetry run uvicorn app.main:app --reload
   ```

Documentação interativa (Swagger): `http://localhost:8000/docs`

---

## Testes

O projeto possui testes unitários e de integração.

```bash
cd backend
poetry run pytest
```

---

## Documentação interna

Decisões arquiteturais (ADRs), guias e contexto interno do time estão em:

```
../docs
```

---

## Boas práticas de time

- Nunca commitar `.env` reais com segredos.
- Sempre commitar migrations (`alembic/versions/*.py`).
- Sempre rodar `alembic upgrade head` após `git pull`.
- Manter regras de negócio em `services/`.
- Manter segurança (RBAC/auth) em `core/` e dependências em `api/`.