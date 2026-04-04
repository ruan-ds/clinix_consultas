# ADR 016 – Definição de FastAPI

## Status
Definido

## Contexto
O sistema tem requisitos críticos de disponibilidade e tempo de resposta por ser um produto clínico. A experiência do usuário depende de processamento rápido e escalabilidade para suportar picos de carga, além de possibilitar integração com serviços assíncronos.

A escolha do framework impacta diretamente a velocidade de desenvolvimento e a facilidade de manutenção para rotas REST, autenticação, validação de dados e documentação automática.

## Decisão
Adotamos FastAPI como framework web para a API principal, considerando:
- Alto desempenho (built sobre Starlette e Uvicorn, comparável a frameworks assíncronos modernos).
- Suporte nativo a `async`/`await`, permitindo rotas não bloqueantes e melhor uso de I/O com PostgreSQL e outros serviços.
- Geração automática de documentação OpenAPI/Swagger e validação com Pydantic.
- Facilidade de integração com middleware, dependency injection, e controles de segurança.

## Consequências
- Melhor capacidade de resposta e apoio à baixa latência em operações clínicas críticas.
- Potencial para maior throughput em concorrência, usando async para chamadas a banco e redes.
- Curva de aprendizado baixa para desenvolvedores Python e convenções limpas de rotas/schemas.
- Requer monitoramento e saneamento para evitar bloqueios em código CPU-bound (executar em workers separados se necessário).
- Dependência do runtime assíncrono (Uvicorn/Gunicorn) e ajuste de config de thread/processo para alta disponibilidade.