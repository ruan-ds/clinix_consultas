# ADR 010 – Definição dos Tipos de Usuário e Relacionamentos

## Status
Definido

## Contexto
O sistema Clinix está em fase inicial de definição de sua arquitetura e modelo de domínio.

É necessário estabelecer de forma clara os tipos de usuários existentes e seus relacionamentos, garantindo uma base consistente para as regras de negócio e controle de acesso.

## Decisão
Definição de três tipos de usuários:
- Paciente
- Funcionário Clinix
- Funcionário de Clínica

Regras de negócio:
- Um funcionário Clinix não pode ser funcionário de clínica.
- Um funcionário de clínica não pode ser funcionário Clinix.
- Qualquer funcionário pode possuir também um perfil de paciente.

## Consequências
- Estrutura clara para o modelo de usuários.
- Separação de responsabilidades entre os tipos de usuários.
- Base para implementação de autenticação e autorização.
- Necessidade de validação das regras definidas.
