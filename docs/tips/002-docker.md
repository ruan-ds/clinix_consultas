# TIP 002 - Docker

## Fluxo básico Docker
- docker compose pull (baixa as imagens)
- docker compose up (baixa as imagens se não existirem e roda o container, inclua -d no final para rodar em segundo plano)
- docker compose down (para os containers e remove a rede criada pelo Compose)

## Verificar containers rodando
- docker compose ps

## Acessar o terminal de um container
- docker compose exec <nome_do_serviço> bash

## Derrubar o container e apagar os volumes
- docker compose down -v

## Verificar logs antes da utilização
- docker logs -f clinix_db (nosso caso, como é um banco de dados, deve retornar: ready for connections)