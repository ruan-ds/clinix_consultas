# ADR 013 – Gestão de Funcionários de Clínica

## Status
Definido

## Contexto
O sistema precisa permitir o gerenciamento de funcionários vinculados às clínicas, garantindo controle de acesso e associação correta com as entidades.

## Decisão
Fluxo de funcionários:
- Cadastro realizado pelo administrador da clínica.

Necessário informar:
- Email
- Senha
- Cargo
- Vínculo com uma pessoa
- Vínculo com uma clínica (o sistema analisará a origem do registro e atribuirá o vínculo)

A equipe Clinix também poderá cadastrar funcionários em clínicas, porém somente mediante solicitação formal (chamado) feita pelo RH ou administrador da clínica.

## Consequências
- Controle descentralizado com supervisão da Clinix.
- Garantia de vínculo correto entre funcionário e clínica.
- Flexibilidade para suporte operacional.
- Necessidade de controle de permissões.