# ADR 008 – Padrões de commit

## Status

Definido

## Contexto

O sistema precisa seguir um padrão rigido de commit.

## Decisão

Antes do versionamento, para arquivos Python, utilizar de Black para formatação e Ruff como linter. Para arquivos JSX e HTML, utilizar de Prettier para formatação e ESLint como linter.

Padrão de commits:

- chore - Criou estrutura
- feat - Criou algo funcional
- fix - Corrigiu erro
- refactor - Refatorou
- docs - Apenas docs
- test - Testes no geral

- mensagens de commit devem ser escritas em inglês, ser generalizadas e usar letras minúsculas (exceto siglas e nomes próprios)

Exemplo: feat: Dockerfile config

Fluxo:
1- bun run lint
2- bun run format
3- git add
4- git commit -m "feat: Dockerfile config"


## Consequências

- Padrão de versionamento
- Facilidade na localização e identificação de alterações no repo
- Boas práticas
