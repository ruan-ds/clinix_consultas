# ADR 012 – Gestão de Clínicas

## Status
Definido

## Contexto
O sistema precisa controlar o cadastro e o ciclo de vida das clínicas dentro da plataforma.

## Decisão
Fluxo de criação de clínica:
- A clínica será cadastrada exclusivamente pela equipe da Clinix.
- O cadastro ocorrerá após contato da clínica com a plataforma e formalização de contrato.
- A equipe Clinix terá controle total sobre o cadastro e ativação da clínica.
- Ao término do contrato, a clínica será desativada no sistema.
- A desativação da clínica implicará no encerramento dos acessos de todos os funcionários vinculados.

Durante o cadastro da clínica, serão informados:
- Nome comercial (trade_name)
- Nome legal (legal_name)
- CNPJ
- Endereço (address_id)
- Status de ativação (is_active)

Após o cadastro, o perfil de administrador será criado e enviado ao responsável pela clínica.

## Consequências
- Centralização do controle de clínicas.
- Garantia de conformidade com contratos.
- Maior controle sobre acesso ao sistema.
- Dependência da equipe interna para gestão de clínicas.