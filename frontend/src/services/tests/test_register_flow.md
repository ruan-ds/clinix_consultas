# 🧪 Testes de Fluxo - Cadastro de Paciente

## 🎯 Objetivo
Validar o fluxo completo de cadastro de paciente no sistema.

---

## ✅ Cenário 1: Cadastro com sucesso

### Passos:
1. Acessar a tela de cadastro
2. Preencher todos os campos obrigatórios da primeira parte:
    - Email
    - Senha
3. Clicar em "Prosseguir"
4. Preencher todos os campos obrigatórios da segunda parte:
    - Nome
    - CPF
    - Telefone
    - CEP
    - Data de Nascimento
    - Sexo
5. Clicar em "Prosseguir"
6. Preencher todos os campos obrigatórios da terceira parte:
    - Estado
    - Cidade
    - Bairro
    - Rua
    - Número
    - Complemento
7. Clicar em "Criar Conta"

### Resultado esperado:
- Requisição enviada para `/registration/patient_access`
- Retorno 200 da API
- Usuário redirecionado

---

## ❌ Cenário 2: Campos vazios

### Passos:
1. Acessar a tela de cadastro
2. Não preencher os campos
3. Clicar em "Prosseguir"

### Resultado esperado:
- Validação impede envio
- Mensagens de erro exibidas nos campos

---

## ❌ Cenário 4: Erro da API

### Passos:
1. Preencher formulário corretamente
2. Simular erro no backend

### Resultado esperado:
- Mensagem de erro exibida
- Nenhum redirecionamento

---

## 🔁 Cenário 5: Email já cadastrado

### Passos:
1. Inserir email já existente
2. Enviar formulário

### Resultado esperado:
- API retorna erro
- Mensagem informando usuário já cadastrado