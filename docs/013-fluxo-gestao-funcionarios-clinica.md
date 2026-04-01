# ADR 013 – Gestão de Funcionários de Clínica

## Status
Definido

## Contexto
O sistema precisa permitir o gerenciamento de funcionários vinculados às clínicas, garantindo controle de acesso e associação correta com as entidades.

## Decisão
O cadastro de funcionários será realizado pelo administrador da clínica ou pelo RH.

Campos obrigatórios: email, senha, cargo e vínculo com uma pessoa.

Caso a pessoa ainda não exista no sistema, será necessário cadastrar seus dados pessoais: nome, CPF, sexo, data de nascimento e endereço.

A equipe Clinix poderá cadastrar funcionários apenas mediante solicitação formal (chamado) feita pelo RH ou administrador da clínica.

## Consequências
- Controle descentralizado com supervisão da Clinix.
- Garantia de vínculo correto entre funcionário e clínica.
- Flexibilidade para suporte operacional.
- Necessidade de controle de permissões.
