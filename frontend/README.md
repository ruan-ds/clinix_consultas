# FRONTEND (MVP) — Clinix

FRONTEND (MVP) — Clinix

1) Contexto e objetivo do Front-end
O front-end deste repositório existe para dar suporte ao MVP do Clinix como serviço (BPO) de marcação de consultas. Ele foi pensado para:
- Permitir uma interface simples para operação e validação do fluxo (ex.: listar agenda, solicitar/agendar, confirmar, reagendar, cancelar).
- Demonstrar integração com a API FastAPI (back-end é a fonte de verdade e valida RBAC).
- Manter baixa complexidade operacional no começo (sem build, sem npm), acelerando entrega e testes com clínicas.

Neste MVP, o front-end é propositalmente “leve”:
- HTML/CSS/JavaScript (Vanilla)
- Comunicação com o back-end via Fetch API (JSON)
- Sem dependências de bundlers, frameworks ou pipeline de build

Motivo: o manifesto prioriza viabilidade e rapidez no MVP, com plano de evolução posterior para React quando APIs/regras estiverem consolidadas.

2) Princípios do front-end no MVP
- Simplicidade: poucas telas, poucos cliques, linguagem clara.
- Acessibilidade: layout legível e responsivo; suporte a operação em ambientes com limitações.
- Segurança: o front-end NÃO substitui a validação de permissões; RBAC deve ser aplicado no back-end.
- Separação clara de responsabilidades:
  - UI/DOM: arquivos em src/js/main.js
  - Cliente HTTP/API: arquivos em src/js/api.js
  - Estilos: src/css/styles.css

3) Estrutura de pastas do Front-end

frontend/
  README.md
  public/
    index.html
  src/
    css/
      styles.css
    js/
      api.js
      main.js

O que vai em cada lugar:
- frontend/public/index.html
  Página principal do MVP. Contém a estrutura base da UI (containers, formulários, listas).

- frontend/src/css/styles.css
  Estilos globais do MVP: layout, tipografia, componentes simples (botões, inputs, cards).

- frontend/src/js/api.js
  Camada de acesso à API (wrapper de fetch):
  - baseURL da API
  - helpers para GET/POST/PATCH/DELETE
  - tratamento de erros
  - (futuro) inclusão do token JWT no header Authorization

- frontend/src/js/main.js
  Lógica de interface:
  - listeners de formulários/botões
  - renderização de listas/tabelas (agendamentos, agenda do dia)
  - chamadas para api.js
  - mensagens de sucesso/erro para o usuário

4) Por que manter “public/” e “src/” mesmo sem build?
Mesmo sem bundler, separar ajuda a organizar:
- public/: arquivos “servidos” diretamente (HTML)
- src/: código-fonte (CSS/JS) que o HTML importa

Você pode referenciar diretamente no HTML com caminhos relativos. Exemplo:
- <link rel="stylesheet" href="../src/css/styles.css">
- <script type="module" src="../src/js/main.js"></script>

5) Exemplos de conteúdo dos arquivos pré-criados (templates)

5.1) frontend/public/index.html (exemplo base)

<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Clinix — MVP</title>
    <link rel="stylesheet" href="../src/css/styles.css" />
  </head>
  <body>
    <main class="container">
      <header>
        <h1>Clinix — MVP</h1>
        <p>Interface simples para validar o fluxo de agendamentos.</p>
      </header>

      <section class="card" id="auth">
        <h2>Login (MVP)</h2>
        <form id="loginForm">
          <label>
            Email
            <input name="email" type="email" required />
          </label>
          <label>
            Senha
            <input name="password" type="password" required />
          </label>
          <button type="submit">Entrar</button>
        </form>
        <p class="hint">No MVP inicial, o back-end pode retornar token placeholder.</p>
      </section>

      <section class="card" id="appointments">
        <h2>Agendamentos</h2>

        <div class="row">
          <button id="btnLoad">Carregar agendamentos</button>
        </div>

        <ul id="appointmentsList" class="list"></ul>

        <h3>Novo agendamento (exemplo)</h3>
        <form id="createAppointmentForm">
          <label>
            Paciente (nome)
            <input name="patient_name" type="text" required />
          </label>
          <label>
            Data/Hora
            <input name="starts_at" type="datetime-local" required />
          </label>
          <button type="submit">Criar</button>
        </form>
      </section>

      <section class="card" id="messages" aria-live="polite"></section>
    </main>

    <script type="module" src="../src/js/main.js"></script>
  </body>
</html>

5.2) frontend/src/css/styles.css (exemplo base)

:root {
  --bg: #0b1220;
  --card: #111b2e;
  --text: #e8eefc;
  --muted: #b7c3df;
  --primary: #5aa2ff;
  --danger: #ff5a7a;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
  background: var(--bg);
  color: var(--text);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.card {
  background: var(--card);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
}

label { display: block; margin: 10px 0; color: var(--muted); }
input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.15);
  color: var(--text);
}
button {
  padding: 10px 12px;
  border-radius: 10px;
  border: 0;
  background: var(--primary);
  color: #071225;
  font-weight: 600;
  cursor: pointer;
}

.list { list-style: none; padding: 0; margin: 0; }
.list li {
  padding: 10px;
  margin: 8px 0;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
}

.hint { color: var(--muted); font-size: 0.9rem; }

5.3) frontend/src/js/api.js (wrapper Fetch)

export const API_BASE_URL = "http://localhost:8000/api/v1";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof data === "string" ? data : (data.detail || "Erro na requisição");
    throw new Error(message);
  }

  return data;
}

export const api = {
  health: () => request("/health"),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  listAppointments: (token) => request("/appointments", { token }),
  createAppointment: (token, payload) => request("/appointments", { method: "POST", token, body: payload }),
};

5.4) frontend/src/js/main.js (UI)

import { api } from "./api.js";

let token = null;

const el = {
  loginForm: document.getElementById("loginForm"),
  createAppointmentForm: document.getElementById("createAppointmentForm"),
  btnLoad: document.getElementById("btnLoad"),
  list: document.getElementById("appointmentsList"),
  messages: document.getElementById("messages"),
};

function showMessage(text, type = "info") {
  el.messages.textContent = text;
  el.messages.className = `card ${type}`;
}

function renderAppointments(items) {
  el.list.innerHTML = "";
  for (const a of items) {
    const li = document.createElement("li");
    li.textContent = `${a.id ?? "#"} — ${a.patient_name ?? "(sem nome)"} — ${a.starts_at ?? ""}`;
    el.list.appendChild(li);
  }
}

el.loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  try {
    const data = await api.login({
      email: form.get("email"),
      password: form.get("password"),
    });
    token = data.access_token;
    showMessage("Login OK", "success");
  } catch (err) {
    showMessage(err.message, "error");
  }
});

el.btnLoad?.addEventListener("click", async () => {
  try {
    const items = await api.listAppointments(token);
    renderAppointments(items);
  } catch (err) {
    showMessage(err.message, "error");
  }
});

el.createAppointmentForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  try {
    const payload = {
      patient_name: form.get("patient_name"),
      starts_at: form.get("starts_at"),
    };
    const created = await api.createAppointment(token, payload);
    showMessage(`Agendamento criado: ${created.id ?? "ok"}`, "success");
  } catch (err) {
    showMessage(err.message, "error");
  }
});

6) Como usar/rodar o Front-end no MVP
- Como é estático, você pode:
  - abrir o arquivo frontend/public/index.html diretamente no navegador, OU
  - servir com uma extensão tipo “Live Server”, OU
  - usar um servidor local simples.

Recomendação: usar um servidor local (Live Server) para evitar problemas de CORS/file:// em alguns navegadores.

7) CORS (importante)
Se o front estiver em http://localhost:5500 (Live Server) e a API em http://localhost:8000:
- O back-end precisa permitir CORS no FastAPI.
- No MVP, isso é comum e esperado.

8) Próximos passos (quando evoluir)
- Adicionar telas por perfil (RBAC): Operador Clinix, Funcionário da Clínica, Paciente.
- Rotas reais de appointments/clinics no back-end.
- Melhorar UX para operação BPO (filas, status, auditoria).
- Evoluir para React quando houver estabilidade nos endpoints.
