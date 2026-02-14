# Clinix Backend — Contexto, Estrutura e Exemplos (MVP FastAPI + MySQL)

## 1) Contexto e propósito do backend
O backend do Clinix é o **núcleo** da solução: ele concentra as regras de negócio, a segurança (**RBAC**), a integridade dos dados e a rastreabilidade do ciclo de agendamento.

A Clinix é um serviço (**BPO**) operado por uma equipe terceirizada, atendendo múltiplas clínicas (contratantes). Isso implica:

- **Multi-clínica (multi-tenant):** a API deve restringir dados por clínica/contratante.
- **Governança e auditoria:** registrar mudanças relevantes (status, remarcações, cancelamentos, confirmações).
- **Segurança:** controle de acesso por perfil (RBAC) aplicado no back-end, e não apenas no front-end.
- **Evolução arquitetural:** começar como monólito modular e permitir extração progressiva para microsserviços.

## 2) Tecnologias escolhidas e o motivo
- **FastAPI:** produtividade + performance + documentação automática (OpenAPI/Swagger).
- **SQLAlchemy:** ORM maduro e flexível; facilita migração/evolução do esquema.
- **MySQL:** base relacional com integridade referencial (chaves/relacionamentos), boa para auditoria.
- **Poetry:** gerenciamento de dependências reproduzível para o time.
- **Uvicorn:** servidor ASGI recomendado para FastAPI.

## 3) Estrutura do backend (visão geral)
**Pasta raiz do backend:**

```text
backend/
  pyproject.toml        -> dependências e metadata (Poetry)
  poetry.lock           -> lockfile (reprodutibilidade)
  .env.example          -> exemplo de variáveis de ambiente
  .env                  -> variáveis reais (NÃO versionar)
  README.md             -> instruções e detalhes específicos do backend (opcional)
  app/                  -> código fonte (API, core, modelos, serviços)
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

## 4) O papel de cada pasta (com exemplos)

### 4.1) `app/main.py` — ponto de entrada
**Responsabilidade:**
- criar a instância do FastAPI
- registrar routers (ex.: `/api/v1`)
- configurar middlewares (no futuro)

**Exemplo (arquivo pré-criado):**
- Define `app = FastAPI(...)`
- Inclui router v1: `app.include_router(...)`

### 4.2) `app/core/` — infraestrutura e *cross-cutting concerns*
Esta pasta contém código que “corta” vários domínios.

**Arquivos típicos:**

- `config.py`
  - Motivo: centralizar leitura de variáveis de ambiente (`DATABASE_URL`, `JWT_SECRET` etc.)
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

**Por que isso importa:**
- O manifesto exige que RBAC seja aplicado principalmente no back-end.
- Centralizar essas funções evita duplicação e erros de segurança.

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
    - Exemplo: `POST /api/v1/auth/login`

  - `clinics.py`
    - Motivo: operações relacionadas à clínica contratante e seu contexto (tenant).

  - `appointments.py`
    - Motivo: ciclo do agendamento: solicitar, confirmar, remarcar, cancelar, registrar falta.

**Por que separar por endpoints:**
- Facilita manutenção e evolução.
- Ajuda a refletir domínios do negócio.

### 4.4) `app/models/` — persistência
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

**Motivo:**
- O manifesto pede integridade e rastreabilidade: banco relacional ajuda a impor consistência.

### 4.5) `app/schemas/` — contratos (Pydantic)
Separar schemas dos models evita:
- vazar detalhes internos do banco
- misturar formato de API com persistência

**Exemplos:**
- `auth.py`
  - `LoginRequest(email, password)`, `TokenResponse(access_token, ...)`

- `appointment.py`
  - `AppointmentCreate(...)`, `AppointmentRead(...)`

### 4.6) `app/services/` — regras de negócio (domínio)
Aqui é onde mora a “inteligência” do Clinix.

**Exemplos de responsabilidades:**
- validar conflitos de horário
- aplicar regras por clínica (políticas)
- registrar transições de status
- preparar indicadores (no-show, tempos de resposta)

**Motivo:**
- Mantém a API (rotas) fina e fácil de entender.
- Facilita extração futura para microsserviços.

## 5) Multi-clínica (tenant) — como pensar no backend
Como o Clinix atende várias clínicas, as entidades principais normalmente carregam `clinic_id`.

**Estratégia MVP (isolamento lógico):**
- Tabelas com coluna `clinic_id`
- Queries **SEMPRE** filtram por `clinic_id` conforme o usuário
- Operador Clinix pode ter escopo multi-clínica; staff da clínica só pode ver sua clínica

Isso tipicamente é implementado em:
- `deps.py` (ex.: `get_current_user` + `tenant_scope`)
- `services/` (garantir que mudanças respeitam o escopo)

## 6) RBAC — exemplos de autorização
**Papéis:**
- **PACIENTE:** cria solicitação e acompanha status
- **CLINICA (staff):** vê agenda da própria clínica, confirma presença/no-show
- **OPERADOR_CLINIX:** opera solicitações multi-clínica, valida dados e corrige inconsistências com rastreabilidade

**Exemplo de regra:**
- Endpoint `POST /appointments/{id}/confirm`
  - permitido para **CLINICA** e **OPERADOR_CLINIX**
  - proibido para **PACIENTE**

## 7) Arquivos “pré-criados” (do skeleton) e como usar
A estrutura sugerida inclui, tipicamente:
- `backend/app/main.py`
- `backend/app/api/v1/router.py`
- `backend/app/api/v1/endpoints/health.py`
- `backend/app/api/v1/endpoints/auth.py` (placeholder)
- `backend/app/core/config.py`
- `backend/app/core/database.py`
- `backend/app/core/rbac.py`

**Observação importante:**
- No início do MVP, dá para criar tabelas via SQLAlchemy (`create_all`) para acelerar.
- Assim que possível, migrar para Alembic para versionar o schema.

## 8) Exemplo de fluxo ponta a ponta (conceitual)
1) Paciente solicita agendamento (por canal externo; operador registra no sistema)
2) Operador Clinix valida dados e cria `Appointment` em status “PENDING/REQUESTED”
3) Operador confirma com paciente e muda status para “CONFIRMED”
4) No dia, staff da clínica registra presença ou no-show
5) Sistema acumula indicadores (taxa de no-show, tempo de confirmação etc.)

## 9) Como rodar o backend (resumo)
1) Configure `backend/.env` (`DATABASE_URL` apontando para MySQL)
2) Instale dependências:
   - `cd backend`
   - `poetry install`
3) Rode a API:
   - `poetry run uvicorn app.main:app --reload`

## 10) Próximos incrementos recomendados
- Alembic (migrations)
- JWT completo (login, refresh, expiração)
- Modelos mínimos completos: `Clinic`, `User` (com `clinic_id`), `Appointment` (status + canal)
- Auditoria: tabela de `appointment_events` (quem alterou, quando, o quê)
- Seed inicial (criar primeiro operador Clinix/admin)
