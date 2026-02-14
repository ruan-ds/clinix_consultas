# Clinix

**Clinix** é uma solução de **BPO (Business Process Outsourcing)** para marcação de consultas e gestão de dados administrativos de clínicas.  
O objetivo é centralizar solicitações vindas de múltiplos canais (presencial, telefone, WhatsApp, e-mail), padronizar o fluxo operacional e garantir **integridade, rastreabilidade e segurança** dos dados de agendamento.

Este repositório contém o MVP da plataforma, com **FastAPI + MySQL** no back-end e um front-end simples em **HTML/CSS/JavaScript (Vanilla)**.

## Visão do Produto

Em muitas clínicas, o agendamento acontece por vários canais e costuma depender de controles paralelos (planilhas, anotações, mensagens). Isso gera:
- demora entre solicitação e confirmação,
- inconsistência entre canais,
- retrabalho (remarcações, conflitos de agenda),
- baixa rastreabilidade,
- absenteísmo (no-show) por falta de confirmação/lembretes,
- dados pouco confiáveis para gestão.

A Clinix atua como uma **central terceirizada de agendamentos**, operada por uma equipe (Operadores Clinix) e suportada por uma plataforma própria.

## Principais Objetivos

- Terceirizar e profissionalizar o processo de marcação de consultas.
- Padronizar e rastrear o fluxo **solicitação → confirmação → atendimento → status final**.
- Centralizar dados com **integridade referencial** (base relacional).
- Reduzir no-show com lembretes/confirmações estruturadas.
- Entregar indicadores e relatórios para apoiar decisões gerenciais.
- Garantir segurança e privacidade (LGPD) com **controle de acesso por perfil (RBAC)**.

## Escopo do MVP

O MVP foca em:
- API REST para cadastro/gestão de clínicas, usuários e agendamentos.
- Fluxo básico de agendamento (solicitar, confirmar, reagendar, cancelar, registrar falta).
- Estrutura multi-clínica (isolamento lógico por contratante).
- RBAC aplicado no **back-end** (permissões por papel).
- Base em MySQL (com evolução planejada para migrações via Alembic).

## Arquitetura (alto nível)

- **Monólito modular no MVP**: módulos bem separados para facilitar extração futura em microsserviços.
- **Regras de negócio no back-end**: o front-end não é a barreira de segurança.
- **Separação por camadas**:
  - `api/` (rotas e dependências)
  - `schemas/` (contratos Pydantic)
  - `models/` (persistência/SQLAlchemy)
  - `services/` (regras de domínio)
  - `core/` (config, segurança, RBAC, banco)

## Controle de Acesso (RBAC)

O sistema aplica **Role-Based Access Control** para suportar o modelo de serviço e governança.

Papéis previstos no MVP:
- **Paciente**: solicita e acompanha agendamentos, recebe orientações/lembretes.
- **Funcionário da Clínica (Contratante)**: visualiza a agenda da própria clínica e opera rotinas do dia a dia (ex.: confirmar presença/no-show).
- **Operador Clinix (BPO)**: gerencia solicitações multi-clínica, valida informações e garante padronização/rastreabilidade.

> Diretriz: permissões devem ser validadas principalmente na API (back-end). O front-end apenas reflete a experiência por perfil.

## Estrutura do Repositório

```text
clinix/
├── backend/                 # FastAPI + MySQL (core do MVP)
└── frontend/                # HTML/CSS/JS (MVP)