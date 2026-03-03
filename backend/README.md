# Clinix Backend — Contexto, Estrutura, Docker, SQLAlchemy e Alembic (MVP FastAPI + MySQL)

## 1) Contexto e propósito do backend

O backend do Clinix é o **núcleo** da solução: ele concentra as regras de negócio, a segurança (**RBAC**), a integridade dos dados e a rastreabilidade do ciclo de agendamento.

A Clinix é um serviço (**BPO**) operado por uma equipe terceirizada, atendendo múltiplas clínicas (contratantes). Isso implica:

- **Multi-clínica (multi-tenant):** a API deve restringir dados por clínica/contratante.
- **Governança e auditoria:** registrar mudanças relevantes (status, remarcações, cancelamentos, confirmações).
- **Segurança:** controle de acesso por perfil (RBAC) aplicado no back-end, e não apenas no front-end.
- **Evolução arquitetural:** começar como monólito modular e permitir extração progressiva para microsserviços.

---

## 2) Tecnologias escolhidas e o motivo

- **FastAPI:** produtividade + performance + documentação automática (OpenAPI/Swagger).
- **SQLAlchemy:** ORM maduro e flexível; facilita modelar o banco em Python e evoluir o esquema.
- **Alembic:** sistema de _migrations_ para versionar e aplicar mudanças de schema de forma segura em todos os ambientes.
- **MySQL:** base relacional com integridade referencial (chaves/relacionamentos), boa para auditoria.
- **Poetry:** gerenciamento de dependências reproduzível para o time (lockfile + ambientes isolados).
- **Uvicorn:** servidor ASGI recomendado para FastAPI.

---

## 3) Estrutura do backend (visão geral)

**Pasta raiz do backend:**

```text
backend/
  pyproject.toml        -> dependências e metadata (Poetry)
  poetry.lock           -> lockfile (reprodutibilidade)
  .env.example          -> exemplo de variáveis de ambiente
  .env                  -> variáveis reais (NÃO versionar)
  README.md             -> instruções e detalhes específicos do backend
  app/                  -> código fonte (API, core, modelos, serviços)
  alembic.ini           -> config principal do Alembic
  alembic/              -> diretório de migrations (criado pelo Alembic)
```

**Estrutura interna recomendada:**

```text
backend/app/
  main.py               -> entrypoint da aplicação FastAPI
  core/                 -> configurações e infraestrutura transversal
  api/                  -> rotas e dependências (versionadas em v1/)
  models/               -> modelos/tabelas SQLAlchemy
  schemas/              -> contratos Pydantic (request/response)
  services/             -> regras de negócio (domínio)
  tests/                -> testes (pytest)
```

---

## 4) O papel de cada pasta (com exemplos)

### 4.1) `app/main.py` — ponto de entrada

**Responsabilidade:**

- criar a instância do FastAPI;
- registrar routers (ex.: `/api/v1`);
- configurar middlewares (no futuro).

**Exemplo (conceitual):**

```python
from fastapi import FastAPI
from app.api.v1.router import api_router

app = FastAPI(title="Clinix API")

app.include_router(api_router, prefix="/api/v1")
```

### 4.2) `app/core/` — infraestrutura e _cross-cutting concerns_

Esta pasta contém código que “corta” vários domínios.

**Arquivos típicos:**

- `config.py`
  - Motivo: centralizar leitura de variáveis de ambiente (`DATABASE_URL`, `JWT_SECRET` etc.).
  - Exemplo: `Settings` via `pydantic-settings`.

- `database.py`
  - Motivo: criar `engine`, `SessionLocal` e `Base` do SQLAlchemy.
  - Exemplo: `get_db()` como dependência injetável nas rotas.

- `security.py`
  - Motivo: autenticação/autorização (hash de senha, JWT, etc.).
  - Exemplo: funções `verify_password()`, `get_password_hash()`, `create_access_token()`.

- `rbac.py`
  - Motivo: definir papéis (Paciente, Clínica, Operador Clinix) e apoiar autorização.
  - Exemplo: enum de roles + helpers de autorização.

### 4.3) `app/api/` — camada de entrega (HTTP)

Aqui ficam:

- `deps.py`
  - Motivo: dependências de rota (DB session, `current_user`, `authorize`, `tenant_scope`).
  - Exemplo: `get_db` (do `database.py`) e uma função `require_roles([...])`.

- `v1/`
  - `router.py`
    - Motivo: organizar endpoints por versão e domínio.

- `endpoints/`
  - `health.py`
    - Motivo: endpoint simples para checar que o serviço está no ar.
    - Exemplo: `GET /api/v1/health -> {"status":"ok"}`

  - `auth.py`
    - Motivo: login e emissão de tokens (quando implementado).
    - Exemplo: `POST /api/v1/auth/login`.

  - `clinics.py`
    - Motivo: operações relacionadas à clínica contratante e seu contexto (tenant).

  - `appointments.py`
    - Motivo: ciclo do agendamento: solicitar, confirmar, remarcar, cancelar, registrar falta.

### 4.4) `app/models/` — persistência (SQLAlchemy)

Aqui ficam as tabelas do banco em SQLAlchemy.

**Exemplos:**

- `user.py`
  - Campos típicos: `id`, `email`, `hashed_password`, `role`, `clinic_id` (quando aplicável), `is_active`.

- `clinic.py`
  - Campos típicos: `id`, `nome`, regras/parametrizações (convênios, especialidades), `status`.

- `appointment.py`
  - Campos típicos: `id`, `clinic_id`, `patient_id`, `professional_id` (futuro), `datetime`, `status`,
    canal (`whatsapp/telefone/presencial/email`), observações, `timestamps`.

- `role.py` (opcional)
  - Se RBAC evoluir para modelo por permissões, pode existir Role/Permission em tabela.

### 4.5) `app/schemas/` — contratos (Pydantic)

Separar schemas dos models evita:

- vazar detalhes internos do banco;
- misturar formato de API com persistência.

**Exemplos:**

- `auth.py`
  - `LoginRequest(email, password)`, `TokenResponse(access_token, ...)`.

- `appointment.py`
  - `AppointmentCreate(...)`, `AppointmentRead(...)`.

### 4.6) `app/services/` — regras de negócio (domínio)

Aqui é onde mora a “inteligência” do Clinix.

**Exemplos de responsabilidades:**

- validar conflitos de horário;
- aplicar regras por clínica (políticas);
- registrar transições de status;
- preparar indicadores (no-show, tempos de resposta).

---

## 5) Multi-clínica (tenant) — como pensar no backend

Como o Clinix atende várias clínicas, as entidades principais normalmente carregam `clinic_id`.

**Estratégia MVP (isolamento lógico):**

- Tabelas com coluna `clinic_id`;
- Queries **SEMPRE** filtram por `clinic_id` conforme o usuário;
- Operador Clinix pode ter escopo multi-clínica; staff da clínica só pode ver sua clínica.

Isso tipicamente é implementado em:

- `deps.py` (ex.: `get_current_user` + `tenant_scope`);
- `services/` (garantir que mudanças respeitam o escopo).

---

## 6) RBAC — exemplos de autorização

**Papéis:**

- **PACIENTE:** cria solicitação e acompanha status;
- **CLINICA (staff):** vê agenda da própria clínica, confirma presença/no-show;
- **OPERADOR_CLINIX:** opera solicitações multi-clínica, valida dados e corrige inconsistências com rastreabilidade.

**Exemplo de regra:**

- Endpoint `POST /appointments/{id}/confirm`:
  - permitido para **CLINICA** e **OPERADOR_CLINIX**;
  - proibido para **PACIENTE**.

---

## 7) Docker + MySQL (para desenvolvimento)

O Docker é usado **apenas para o banco MySQL em desenvolvimento**, mantendo o backend rodando via Poetry na sua máquina.

### 7.1) Arquivos na raiz do repositório

Na raiz (fora de `backend/`), temos:

- `docker-compose.yml` — definição do serviço `db` (MySQL).
- `.env` — credenciais do MySQL usadas pelo Docker e pelo backend.

**Exemplo de `docker-compose.yml` (raiz):**

```yaml
services:
  db:
    image: mysql:8.0
    container_name: clinix_db
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - clinix_db_data:/var/lib/mysql
    command: ["--default-authentication-plugin=mysql_native_password"]

volumes:
  clinix_db_data:
```

**Pontos importantes:**

- O banco roda em `localhost:3306` para o backend (via Poetry).
- As credenciais vêm do `.env` na raiz.

### 7.2) Exemplo de `.env` (raiz)

```env
MYSQL_ROOT_PASSWORD=rootpassword123
MYSQL_DATABASE=clinix
MYSQL_USER=clinix_user
MYSQL_PASSWORD=clinix_password

DATABASE_URL=mysql+pymysql://clinix_user:clinix_password@localhost:3306/clinix
```

> `DATABASE_URL` será consumida pelo backend (via `backend/.env` ou via variáveis de ambiente exportadas).

### 7.3) Subindo o banco para desenvolvimento

Na raiz do repositório:

```bash
docker-compose up -d
```

- Isso sobe apenas o MySQL em segundo plano.
- Para ver containers ativos: `docker ps`.
- Para derrubar: `docker-compose down` (ou `docker-compose down -v` se quiser apagar os dados).

---

## 8) SQLAlchemy + Alembic — como trabalham juntos

### 8.1) SQLAlchemy

- Você declara os modelos de tabela em `app/models/`.
- Exemplo simplificado de `User`:

```python
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=True)
    is_active = Column(Boolean, default=True)
```

### 8.2) Alembic

O Alembic cuida das _migrations_, ou seja, dos arquivos que representam as mudanças de schema ao longo do tempo.

Fluxo típico:

1. Dev altera/gera um modelo SQLAlchemy em `app/models/`.
2. Dev roda:
   ```bash
   alembic revision --autogenerate -m "mensagem da mudança"
   ```
   Isso gera um arquivo em `alembic/versions/` com os comandos de alteração de schema.
3. Dev aplica a migration localmente:
   ```bash
   alembic upgrade head
   ```
4. Dev faz `git add` do arquivo de migration e commita.
5. Outros devs dão `git pull` e rodam `alembic upgrade head` para atualizar seus bancos locais.

> Resultado: **todos os devs e ambientes compartilham a mesma “linha do tempo” de alterações de banco**, sem precisar copiar dump da produção.

### 8.3) Integração com `alembic.ini`

No `alembic.ini` (na pasta `backend/`), a `sqlalchemy.url` deve apontar para o `DATABASE_URL`. Recomendado:

- Não deixar a URL fixa no `alembic.ini`.
- Ler do ambiente (ex.: usando `env.py` customizado) para reutilizar a mesma URL do `config.py`.

Exemplo simples (no `env.py` do Alembic):

```python
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from app.core.database import Base  # Base do SQLAlchemy com os models importados

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline():
    url = os.getenv("DATABASE_URL")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
        {
            "sqlalchemy.url": os.getenv("DATABASE_URL")
        },
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
```

---

## 9) Fluxo diário para devs (backend)

1. Garantir que o banco está rodando:

   ```bash
   docker-compose up -d
   ```

2. Entrar na pasta `backend/`:

   ```bash
   cd backend
   ```

3. Instalar dependências (primeira vez ou após mudanças):

   ```bash
   poetry install
   ```

4. Atualizar o schema do banco para a última versão de migrations:

   ```bash
   alembic upgrade head
   ```

5. Rodar a API em modo dev:

   ```bash
   poetry run uvicorn app.main:app --reload
   ```

6. Acessar a documentação interativa (Swagger):
   - [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 10) Boas práticas de time

- **Nunca** commitar `.env` reais com senhas.
- **Sempre** commitar migrations Alembic (`alembic/versions/*.py`).
- **Sempre** rodar `alembic upgrade head` depois de dar `git pull`.
- Usar Docker apenas para o banco em dev; o backend roda via Poetry.
- Manter as regras de negócio em `services/` e a segurança (RBAC, auth) em `core/` + dependências de `api/`.

---

## 11) Próximos incrementos recomendados

- JWT completo (login, refresh, expiração).
- Modelos mínimos completos: `Clinic`, `User` (com `clinic_id`), `Appointment` (status + canal).
- Auditoria: tabela de `appointment_events` (quem alterou, quando, o quê).
- Seeds iniciais para criar o primeiro operador Clinix/admin.
