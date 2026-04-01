# ADR 008 – Padrões de commit

## Status

Definido

## Contexto

O sistema precisa seguir um padrão rígido de commit para facilitar rastreabilidade e revisão.

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
- o escopo é obrigatório e deve identificar a área afetada pelo commit

Formato: `tipo(escopo): mensagem`

Exemplos de escopos: `auth`, `appointments`, `users`, `clinics`, `models`, `schemas`, `services`, `api`, `core`, `docker`, `adr-00x`, `readme`

Exemplos:
- `feat(appointments): add appointment creation endpoint`
- `fix(auth): correct token expiration validation`
- `docs(adr-006): update package manager from NPM to Bun`
- `chore(docker): add postgres service to compose`

Fluxo:
1- git add
2- git commit -m "feat(escopo): mensagem"
3- (code review)
4- bun run lint / poetry run ruff check
5- bun run format / poetry run black .
6- git add
7- git commit -m "chore(escopo): apply formatting after review"

> Formatadores (Black, Ruff, Prettier, ESLint) devem ser executados **após** o code review estar aprovado, não antes. Rodar formatadores antes polui o diff com mudanças puramente estéticas, dificultando a revisão.

## Consequências

- Padrão de versionamento
- Facilidade na localização e identificação de alterações no repo
- Boas práticas
- Diffs de review limpos, sem ruído de formatação automática
