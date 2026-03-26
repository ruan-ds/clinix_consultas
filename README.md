# Clinix

![Python](https://img.shields.io/badge/Python-3.13-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-backend-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-frontend-61DAFB?logo=react&logoColor=black)
![License](https://img.shields.io/badge/license-Open--Source%20Autoral-blue)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

**Clinix** é uma solução de **BPO (Business Process Outsourcing)** para marcação de consultas e gestão de dados administrativos de clínicas.
O objetivo é centralizar solicitações vindas de múltiplos canais (presencial, telefone, WhatsApp, e-mail), padronizar o fluxo operacional e garantir **integridade, rastreabilidade e segurança** dos dados de agendamento.

Este repositório contém a plataforma Clinix, com **FastAPI + PostgreSQL** no backend e um frontend em **React + TypeScript**.

---

## Demo

O protótipo de interface está disponível no Figma:
**Acessar protótipo no Figma →** (https://www.figma.com/site/l3HKqgjDUaQutbjHsKcy7B/Clinix?node-id=0-1&t=a90QyX7mZNNS0r0D-1)

> Deploy planejado na **AWS**. API e interface estarão disponíveis publicamente em versão futura.

---

## Visão do Produto

Em muitas clínicas, o agendamento acontece por vários canais e costuma depender de controles paralelos (planilhas, anotações, mensagens). Isso gera:
- demora entre solicitação e confirmação,
- inconsistência entre canais,
- retrabalho (remarcações, conflitos de agenda),
- baixa rastreabilidade,
- absenteísmo (no-show) por falta de confirmação/lembretes,
- dados pouco confiáveis para gestão.

A Clinix atua como uma **central terceirizada de agendamentos**, operada por uma equipe (Operadores Clinix) e suportada por uma plataforma própria.

---

## Principais Objetivos

- Terceirizar e profissionalizar o processo de marcação de consultas.
- Padronizar e rastrear o fluxo **solicitação → confirmação → atendimento → status final**.
- Centralizar dados com **integridade referencial** (base relacional).
- Reduzir no-show com lembretes/confirmações estruturadas.
- Entregar indicadores e relatórios para apoiar decisões gerenciais.
- Garantir segurança e privacidade (LGPD) com **controle de acesso por perfil (RBAC)** —  endpoints críticos protegidos por autenticação na API.

---

## Escopo Atual

- API REST para cadastro/gestão de clínicas, usuários e agendamentos.
- Fluxo básico de agendamento (solicitar, confirmar, reagendar, cancelar, registrar falta).
- Estrutura multi-clínica (isolamento lógico por contratante).
- RBAC aplicado no **backend** (permissões por papel).
- Banco relacional com **PostgreSQL** e **migrations com Alembic**.

---

## Stack Tecnológica

- **backend:** FastAPI, PostgreSQL, SQLAlchemy, Alembic
- **frontend:** React, TypeScript
- **Testes:** Pytest
- **Infra de desenvolvimento:** Docker

---

## Arquitetura (alto nível)

- **Monólito modular**: módulos bem separados para facilitar extração futura em microsserviços.
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