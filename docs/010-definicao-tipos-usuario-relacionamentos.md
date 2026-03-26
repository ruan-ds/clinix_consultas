# ADR 010 – Padronização dos Fluxos de Usuários e Clínica

## Status
Definido

## Contexto
O sistema Clinix precisa definir fluxos claros para cadastro, autenticação e gerenciamento de usuários e clínicas.

Além disso, é necessário estabelecer regras de relacionamento entre os diferentes tipos de usuários, garantindo consistência, segurança e controle de acesso dentro da aplicação.

## Decisão
Para padronizar o funcionamento do sistema, foram definidos os seguintes fluxos e regras:

Definição de três tipos de usuários:
- Paciente
- Funcionário Clinix
- Funcionário de Clínica

Regras de negócio:
- Um funcionário Clinix não pode ser funcionário de clínica.
- Um funcionário de clínica não pode ser funcionário Clinix.
- Qualquer usuário pode possuir também um perfil de paciente.

Fluxo de criação de conta de paciente dividido em duas etapas:
- Criação da conta com email e senha.
- Preenchimento de dados pessoais (nome, CPF, sexo, data de nascimento e endereço).

Fluxo de login:
- Realizado com email (ou CPF) e senha.
- Validação das credenciais no banco de dados.
- Liberação de acesso conforme o perfil do usuário.

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

Fluxo de funcionários:
- Cadastro realizado pelo administrador da clínica.
- Necessário informar:
- Email
- Senha
- Cargo
- Vínculo com uma pessoa
- Vínculo com uma clínica (O sistema analisará a origem do registro do novo funcionário e atribuirá o vinculo)

A equipe Clinix também poderá cadastrar funcionários em clínicas,porém somente mediante solicitação
formal (chamado) feita pelo RH ou administrador da clínica.

## Consequências
- Padronização dos fluxos principais do sistema.
- Separação clara de responsabilidades entre os tipos de usuários.
- Maior controle de acesso e segurança.
- Centralização do controle de clínicas pela equipe Clinix.
- Garantia de conformidade com contratos das clínicas.
- Estrutura preparada para evolução futura do sistema.
- Aumento da complexidade na validação de regras e permissões.