
# ADR 005 – Uso de tabela Entidade(entity) centralizada

## Status
Definido

## Contexto
O sistema precisa armazenar telefones e outros atributos comuns para diferentes tipos de registros, como pessoas e clínicas.  

A equipe discutiu alternativas:
- Criar tabelas separadas para cada tipo → duplicação de estrutura, manutenção complicada
- Criar uma entidade central → flexível, menos duplicação

## Decisão
Criar uma tabela "entity" que funciona como supertipo.

- Cada entidade possui um ID único.
- As tabelas "Pessoa" e "Clínica" usam o ID da entidade como PK e FK.
- A tabela "Telefone" referencia o ID da entidade, permitindo múltiplos telefones por entidade.

## Consequências
- Estrutura flexível para novos tipos de entidades
- Redução de duplicação no banco
- Necessidade de criar entidade antes de registrar pessoa ou clínica