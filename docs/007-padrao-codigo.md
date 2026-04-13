
# ADR 007 – Padrões de código

## Status
Definido

## Contexto
O sistema precisa seguir um padrão rigido de escrita.

## Decisão
Seguir o PEP8:
- funções e variaveis(snake_case) - def funcao_exemplo() / variavel_exemplo = x
- classes(PascalCase) - class ClasseExemplo
- constantes(UPPER_SNAKE_CASE) - CONSTANTE_EXEMPLO
- espaço entre funções - duas linhas em branco
- limite de caracteres por linha - 79
- imports no topo e separados
- espaços - spam(ham[1], {eggs: 2})
- evitar linhas complexas

## Boas Práticas

- Não executar formatadores (Black, Ruff, Prettier, ESLint) antes de um code review — a formatação deve ocorrer somente após o review estar aprovado, para não poluir o diff com mudanças puramente estéticas.

## Consequências
- Alinhamento com padrões originais
- Maior legibilidade e organização