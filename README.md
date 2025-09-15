# TechBlog Web — MVP (Frontend)

Aplicação **Next.js (App Router)** para consumir a **TechBlog API** do desafio. Permite **listar/ler artigos**, **buscar por texto**, **filtrar por tags** e **interagir com comentários** (com **login via usuários do seed** do backend).

[![Status](https://img.shields.io/badge/status-MVP-green)]()
[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-on-blue)]()
[![Tailwind](https://img.shields.io/badge/TailwindCSS-on-38B2AC)]()

---

## Sumário

* [Visão Geral](#visão-geral)
* [Pré-requisitos](#pré-requisitos)
* [Ambiente (.env.local)](#ambiente-envlocal)
* [Como Rodar](#como-rodar)
* [Fluxos Principais](#fluxos-principais)
* [Integração com a API](#integração-com-a-api)
* [UI/UX & Acessibilidade](#uiux--acessibilidade)
* [Roadmap Frontend](#roadmap-frontend)

---

## Visão Geral

* **Objetivo:** prover interface simples e responsiva para **Artigos**, **Tags** e **Comentários**.
* **Autenticação:** e-mail/senha → **JWT** (login com usuários do **seed** do backend).
* **Principais telas:**

  * **/login** — autenticação
  * **/** ou **/artigos** — listagem com **busca** e **filtro por tags**
  * **/artigos/\[slug]** — leitura do artigo + **comentários** (threading)


* **App Router** (Next 15+): rotas em `src/app/pages`.
* **Estilização:** **TailwindCSS**.
* **Estado de dados:** hooks + fetch; opcional TanStack Query para cache/infinite scroll.


---

## Pré-requisitos

* **Node.js 22+**
* **npm**
* **TechBlog API** rodando e acessível localmente

---

## Ambiente (.env.local)

Crie um arquivo **`.env.local`** na raiz:

```env
# URL base da API (ex.: Nest expõe /api)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

---

## Como Rodar

```bash
# 1) Instalar dependências
npm install

# 2) Subir o app no modo dev
npm run dev
```

---

## Fluxos Principais

### Login

1. Usuário informa `email` e `password`.
2. Front envia `POST /auth/login` para a API.
3. Em sucesso, **armazenar o JWT** (MVP: `localStorage`).
4. Redirecionar para a Home.

### Listagem de artigos

* Query params: `page`, `size`, `tags`, `search`.
* UI exibe **chips de tags**, **campo de busca** e **paginação** (*offset*).

### Leitura do artigo + comentários

* Buscar artigo por `slug`.
* Listar comentários com **cursor** (`after`) e `size`.
* Enviar comentário (exige login).

---

## Integração com a API

### Convenções

* **Base URL:** `NEXT_PUBLIC_API_BASE_URL`
* **Auth:** `Authorization: Bearer <token>` quando autenticado
* **Paginação (offset):**

  ```json
  { "data": [/* ... */], "meta": { "page": 1, "size": 10, "total": 42 } }
  ```
* **Cursor (comentários):**

  ```json
  { "data": [/* ... */], "meta": { "size": 10, "nextCursor": "..." } }
  ```

---

## UI/UX & Acessibilidade

* **Paginação**: *offset* para artigos; *cursor* para comentários.
* **Estados**: carregando, vazio (“nenhum artigo encontrado”), erro com retry.
* **Responsividade**: layout mobile-first, grid/cards.

---

## Qualidade

* **Lint/Format**: `npm run lint` + Prettier.

---

## Roadmap Frontend

* **Debounce** para barras de pesquisa e tags
* **Cache de dados** com TanStack Query; **infinite scroll** em comentários.
* **Design System** (componentes base).
* **Reações e favoritos**, **perfil do autor**, **gerenciamento de usuários**.
* **Observabilidade**.
