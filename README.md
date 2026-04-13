# Clinix

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/fastapi-%23009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/react-%2361DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23336791?style=for-the-badge&logo=postgresql&logoColor=white)

**Clinix** é uma solução de **BPO (Business Process Outsourcing)** para agendamento de consultas e gestão administrativa de clínicas. Atende equipes que precisam centralizar solicitações de canais como presencial, telefone, WhatsApp e e-mail, reduzindo retrabalho, inconsistência e falta de rastreabilidade.

A plataforma combina backend em **FastAPI + PostgreSQL** com frontend em **React + TypeScript**. Backend centraliza regras de negócio, RBAC e persistência; frontend entrega a interface ao usuário.

## Status

Em desenvolvimento

---

## Demo

O protótipo de interface está disponível no Figma:
**Acessar protótipo no Figma →** (https://www.figma.com/site/l3HKqgjDUaQutbjHsKcy7B/Clinix?node-id=0-1&t=a90QyX7mZNNS0r0D-1)

> **Deploy planejado: AWS** — API e interface estarão disponíveis publicamente em versão futura.

---

## Funcionalidades principais

- API REST para cadastro/gestão de clínicas, usuários e agendamentos.
- Fluxo básico de agendamento (solicitar, confirmar, reagendar, cancelar, registrar falta).
- Estrutura multi-clínica (isolamento lógico por contratante).
- RBAC aplicado no **backend** (permissões por papel).
- Banco relacional com **PostgreSQL** e **migrations com Alembic**.

---

## Tecnologias

- Backend: FastAPI, PostgreSQL e Alembic.
- Frontend: React e TypeScript.
- Testes: Pytest.
- Dev: Docker.

---

## Como rodar o projeto

### Backend

```bash
docker compose up
cd backend
poetry install
poetry run alembic upgrade head
poetry run uvicorn app.main:app --reload
```

A documentação interativa do backend estará disponível em:

```text
http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
bun install
bun run dev
```

A aplicação frontend pode ser acessada em:

```text
http://localhost:5173
```

> Se o backend estiver rodando localmente, o frontend deve consumir a API em `http://localhost:8000`.

---

## Arquitetura (alto nível)

- **Monólito modular (preparado para futura extração em microsserviços)**: módulos bem separados para facilitar evolução.
- **Regras de negócio no backend**: o frontend não é a barreira de segurança.
- **Separação por camadas** (backend):
  - `api/` (rotas e dependências)
  - `schemas/` (contratos Pydantic)
  - `models/` (persistência/SQLAlchemy)
  - `services/` (regras de domínio)
  - `core/` (config, segurança, RBAC, banco)

---

## Controle de Acesso (RBAC)

O sistema aplica **Role-Based Access Control** no backend para suportar o modelo de serviço e garantir segurança operacional.

Papéis previstos:
- Paciente
- Funcionário da Clínica (Contratante)
- Operador Clinix (BPO)

> As permissões são validadas na API; o frontend apenas reflete a experiência por perfil.

---

## Estrutura do Repositório

```text
clinix/
├── backend/                 # FastAPI + SQLAlchemy + Alembic + PostgreSQL
├── frontend/                # React + TypeScript
├── docs/                    # Documentação e contexto do projeto
└── docker-compose.yml       # Stack de desenvolvimento
```

---

## Como navegar neste repositório

Para detalhes técnicos de execução e desenvolvimento:
- `backend/README.md` — contexto técnico do backend, setup local, migrations e testes
- `frontend/README.md` — contexto técnico do frontend
- `docs/` — ADRs, decisões arquiteturais e guias internos

---

## Time

| Membro | Papel | GitHub |
|---|---|---|
| Ruan | backend & Tech Lead | [@ruan-ds](https://github.com/ruan-ds) |
| Bernardo | backend | [@Bernardo-Policarpo](https://github.com/Bernardo-Policarpo) |
| Pablo | frontend — UI & Design | [@dev-pabloF](https://github.com/dev-pabloF) |
| Lucas | frontend — UX | [@Lucas-Gama360](https://github.com/Lucas-Gama360) |
| Gabriel | frontend — Design & Protótipo | [@Furlanf60](https://github.com/Furlanf60) |