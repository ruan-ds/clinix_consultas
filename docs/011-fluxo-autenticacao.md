# ADR 011 – Fluxo de Autenticação

## Status
Definido

## Contexto
O sistema necessita de um fluxo padronizado de autenticação para permitir acesso seguro aos usuários.

## Decisão
Fluxo de criação de conta de paciente dividido em duas etapas:
- Preenchimento de email (ou CPF) e senha.
- Completar dados pessoais (nome, CPF, sexo, data de nascimento e endereço).

Fluxo de login:
- Preenchimento de email (ou CPF) e senha.
- Validação das credenciais no banco de dados.
- Liberação de acesso conforme o perfil do usuário.

## Consequências
- Padronização do processo de autenticação.
- Separação entre credenciais e dados pessoais.
- Base para evolução futura do sistema.
