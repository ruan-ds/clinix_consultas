# ADR 014 – Fluxo de Atualização de Endereço

## Status
Definido

## Contexto
O sistema permite que diferentes entidades (como pacientes, funcionários e clínicas) realizem a atualização de seus endereços.

Considerando que um mesmo endereço pode estar associado a múltiplas entidades, é necessário estabelecer um fluxo controlado de atualização que evite redundância de dados, minimize a criação de registros duplicados e preserve a integridade referencial do banco de dados.

Além disso, é importante diferenciar situações em que o endereço pode ser atualizado diretamente daquelas em que deve ser reutilizado ou recriado, garantindo consistência e eficiência no armazenamento das informações.

## Decisão
Para padronizar a atualização de endereços, foi definido o seguinte fluxo:

Ao receber um novo endereço, o sistema deve:
- Verificar se o endereço atual é compartilhado ou exclusivo.
(Um endereço é considerado compartilhado quando está vinculado a mais de uma entidade no banco de dados)

Caso o endereço atual seja exclusivo:
- Se o novo endereço não existir no banco:
  Atualizar o registro atual com os novos dados.
- Se o novo endereço já existir no banco:
  Apenas substituir a referência para o endereço já existente.

Caso o endereço atual seja compartilhado:
- Se o novo endereço já existir no banco:
  Apenas substituir a referência para o endereço já existente.
- Se o novo endereço não existir no banco:
  Criar um novo registro de endereço com os dados informados e atualizar a referência para o novo endereço criado.

## Consequências
- Redução de duplicidade de endereços no banco de dados.
- Preservação da integridade de dados em registros compartilhados.
- Melhor aproveitamento de registros já existentes.
- Aumento da complexidade na lógica de atualização.
- Necessidade de verificação adicional para identificar compartilhamento de endereço.
