# TIP 002 - Docker

## Fluxo básico Docker
- docker compose up (baixa as imagens)
- docker compose up (roda o container, inclua -d no final para rodar em segundo plano)
- docker compose down (para os containers e remove a rede criada pelo Compose)

## Verificar containers rodando
docker compose ps

## Acessar o terminal de um container
docker compose exec <nome_do_serviço> sh