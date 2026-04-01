# Clinix frontend

Este diretório contém o frontend da plataforma Clinix.

A aplicação foi construída com **React + TypeScript**, utilizando **Vite** como build tool e **Bun** como gerenciador de pacotes.

Este README foca no contexto técnico do frontend: estrutura, execução local e convenções de desenvolvimento.

---

## Stack Tecnológica

- **React** (componentes e SPA/MPA)
- **TypeScript**
- **Vite (build tool)**
- **Bun (gerenciador de pacotes)**
- **React Router (roteamento)**
- **ESLint + Prettier (qualidade de código)**

---

## Arquitetura

O frontend é uma **SPA (Single Page Application)** com entrada única via `index.html`, organizada em múltiplas páginas lógicas roteadas via React Router. Os componentes modulares do React são reutilizados entre essas páginas, combinando a flexibilidade do roteamento client-side com uma estrutura de UI composável.

---

## Estrutura do frontend

```text
frontend/
  index.html            -> ponto de entrada HTML
  vite.config.js        -> configuração do Vite
  tsconfig.json         -> configuração do TypeScript
  package.json          -> dependências e metadata (Bun)
  bun.lock              -> lockfile (reprodutibilidade)
  src/
    assets/             -> recursos estáticos
    components/         -> componentes reutilizáveis
    pages/              -> páginas da aplicação
```

> A estrutura pode evoluir conforme o frontend avance, mas a separação entre páginas e componentes deve ser preservada.

---

## Navegação e Interface

A navegação do frontend utiliza **React Router** para organizar a experiência da aplicação.

- Páginas representam fluxos e contextos de uso;
- Componentes concentram reutilização visual e comportamental;
- Rotas organizam a navegação sem transferir regras de segurança para o cliente;
- A lógica de autorização e validação de permissões pertence ao backend; o frontend apenas reflete a experiência adequada ao perfil autenticado.

---

## Integração com a API

O frontend consome a **API REST** do backend da Clinix.

Diretrizes de integração:

- Utilizar o **Swagger/OpenAPI** do FastAPI como referência de contratos;
- Manter alinhamento entre requests/responses e os tipos definidos no frontend;
- Evitar lógica de negócio no cliente quando ela já pertence ao backend;
- Tratar estados de carregamento, erro e sucesso de forma explícita na interface.

---

## Execução Local (Bun + Vite)

1. Entrar na pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instalar dependências:
   ```bash
   bun install
   ```
3. Rodar o servidor de desenvolvimento:
   ```bash
   bun run dev
   ```
4. Acessar a aplicação em `http://localhost:5173`

Documentação da API (Swagger): `http://localhost:8000/docs`

---

## Desenvolvimento

Durante o desenvolvimento, utilize os scripts disponíveis no `package.json`:

- **Desenvolvimento:** `bun run dev` — inicia o servidor de desenvolvimento com hot reload.
- **Build:** `bun run build` — gera os arquivos otimizados para produção em `dist/`.
- **Preview:** `bun run preview` — visualiza o build de produção localmente.
- **Lint:** `bun run lint` — executa o ESLint para verificar e corrigir problemas de código.
- **Format:** `bun run format` — formata o código usando Prettier.

---

## Qualidade de Código

O projeto utiliza **ESLint** e **Prettier** para manter a qualidade e consistência do código:

- ESLint: regras de linting configuradas em `eslint.config.js`.
- Prettier: formatação automática de código.
- Execute `bun run lint` e `bun run format` **após** o code review aprovado, antes do merge.

---

## Testes

Testes unitários e de integração estão planejados para o frontend, utilizando **Vitest** ou **Jest**.

---

## Build e Deploy

Para produção:

1. Executar o build:
   ```bash
   bun run build
   ```
2. Os arquivos otimizados estarão em `dist/`.
3. Para deploy, copie os arquivos de `dist/` para o servidor web ou utilize um serviço de hospedagem (ex.: Vercel, Netlify).

---

## Documentação Interna

Decisões arquiteturais, guias e contexto interno do time estão em:

```
../docs
```

---

## Boas Práticas de Time

- Executar `bun run lint` e `bun run format` somente após o code review estar aprovado — não antes do commit, para não poluir o diff.
- Manter a separação entre `components/` e `pages/` clara.
- Utilizar TypeScript para tipagem estática e reduzir bugs.
- Seguir as convenções de commit e PR definidas em `../docs/`.
- Evitar lógica de negócio no frontend; delegar para o backend.
