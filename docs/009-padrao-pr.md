
# ADR 009 – Padrões de PR

## Status
Definido

## Contexto
As PRs estavam abordando múltiplas áreas ao mesmo tempo e continham muita poluição visual, tornando a revisão demorada e menos eficiente.

## Decisão
Para aumentar a eficiência e agilidade na revisão e integração das PRs:

- Não executar os formatadores e linters do projeto enquanto a PR não for aprovada.

- Limitar cada PR a uma única área de alteração, evitando sobrecarga na revisão.

## Consequências
- Maior profissionalismo e consistência no código.
- Revisões mais rápidas e objetivas, facilitando a aprovação.
- Menor risco de conflitos e bugs, já que as alterações são menores e mais isoladas.
- Facilita o rastreio histórico e entendimento das mudanças no projeto.
- Incentiva os desenvolvedores a estruturarem melhor suas PRs e commits.