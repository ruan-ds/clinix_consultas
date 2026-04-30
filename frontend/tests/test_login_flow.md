# 🧪 Testes de Fluxo - Login de Usuário

## 🎯 Objetivo

Validar o fluxo completo de autenticação de usuário no sistema.

---

## ✅ Cenário 1: Login com sucesso

### Passos:

1. Acessar a tela de login
2. Preencher os campos obrigatórios:

   * Email
   * Senha
3. Clicar em "Entrar"

### Resultado esperado:

* Requisição enviada para `/login/patient_access`
* Retorno 200 da API
* Usuário autenticado no sistema
* Redirecionamento para tela principal (home/dashboard)

---

## ❌ Cenário 2: Campos vazios

### Passos:

1. Acessar a tela de login
2. Não preencher os campos
3. Clicar em "Entrar"

### Resultado esperado:

* Validação impede envio do formulário
* Mensagens de erro exibidas nos campos obrigatórios

---

## ❌ Cenário 3: Credenciais inválidas

### Passos:

1. Acessar a tela de login
2. Preencher:

   * Email inválido ou não cadastrado
   * Senha incorreta
3. Clicar em "Entrar"

### Resultado esperado:

* Requisição enviada para `/login/patient_access`
* API retorna erro (ex: 401)
* Mensagem de erro exibida ao usuário (ex: "Email ou senha inválidos")
* Nenhum redirecionamento ocorre

---

## ❌ Cenário 4: Erro da API

### Passos:

1. Acessar a tela de login
2. Preencher os campos corretamente
3. Simular erro no backend (ex: erro 500 ou falha de conexão)
4. Clicar em "Entrar"

### Resultado esperado:

* Requisição enviada para `/login/patient_access`
* API retorna erro
* Mensagem genérica exibida (ex: "Erro ao realizar login, tente novamente")
* Nenhum redirecionamento ocorre

---

## 🔁 Cenário 5: Navegação para cadastro

### Passos:

1. Acessar a tela de login
2. Clicar em "Cadastre-se aqui"

### Resultado esperado:

* Função de navegação (`changeAuth`) é chamada
* Usuário é direcionado para tela de cadastro

---

## ⚠️ Observações

Para que todos os cenários sejam validados corretamente, o sistema deve possuir:

* Validação de campos no frontend
* Tratamento de erros da API
* Exibição de mensagens de erro ao usuário
* Lógica de redirecionamento após login
