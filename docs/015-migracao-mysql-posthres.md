# ADR 015 – Migração de MySQL para PostgreSQL

## Status
Definido

## Contexto
Durante o desenvolvimento, enfrentamos problemas recorrentes no MySQL na camada de migrações e manipulação de tabelas. Em alguns cenários, a migration era iniciada e quebrava no meio do processo. Isso deixava o banco com alterações parciais e inconsistentes, já que não havia rollback automático de todas as operações.

A instabilidade foi agravada em alterações de schema mais complexas (chaves estrangeiras, índices compostos, alterações de tipos e colunas não nulas), onde um erro poderia deixar o banco em estado inválido e exigir intervenções manuais.

Para garantir consistência, confiabilidade e melhor suporte transacional de DDL, decidimos migrar a base de dados para PostgreSQL.

## Decisão
Adotamos PostgreSQL como SGBD padrão para o projeto, levando em conta os seguintes pontos:
- PostgreSQL oferece transações mais robustas em operações de migração (DDL) e maior previsibilidade em rollback.
- Melhor compatibilidade com o ecossistema de ORMs e suporte a tipos avançados.
- Ferramentas de migração (Alembic) são mais maduras com PostgreSQL e o tempo de desenvolvimento e manutenção diminui.
- Eliminar dependência do comportamento de MySQL que permitia migrações parcialmente aplicadas sem coerência transacional.

## Consequências
- Redução de casos em que migrações quebravam e deixavam o banco inconsistente.
- Maior controle de integridade referencial durante alterações de schema.
- Carga inicial de adaptação da equipe na nova stack (syntax SQL e configuração de conexões alterada).
- Necessidade de migração dos dados existentes do MySQL para PostgreSQL (dump/export/import ou ferramentas de ETL).
- Mais aderência às boas práticas de CI/CD com rollback seguro em pipelines de migração.
