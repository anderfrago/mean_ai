# mean_ai

MEAN stack application scaffold for `anderfrago/mean_ai`.

## Stack

- MongoDB
- Express
- Angular
- Node.js
- TypeScript

## Requirements

- Node.js 20.11 or newer
- npm 10 or newer
- Docker, if running MongoDB with Compose

## Setup

```bash
npm install
cp .env.example .env
docker compose up -d
npm run dev
```

Run `npm install` from the repository root. npm workspaces will install dependencies into the root `node_modules/` directory and link the `client` and `server` workspaces.

Keep `.env` in the repository root. The backend resolves it correctly whether it is started from the root scripts or directly from `server/`.

The API runs on `http://localhost:3000`.

The Angular app runs on `http://localhost:4200`.

To enable AI-generated product descriptions, configure the server environment:

```bash
export OPENAI_API_KEY="your_api_key_here"
export OPENAI_MODEL="gpt-5.4-mini"
```

`OPENAI_MODEL` is optional. The API key must remain server-side and must never be exposed through Angular environment files.

During development, CORS accepts Angular from `localhost` or `127.0.0.1` on any port. For production, configure one or more exact origins separated by commas:

```bash
CLIENT_ORIGIN="https://app.example.com,https://admin.example.com"
```

## Scripts

```bash
npm run dev
npm run frontend
npm run backend
npm run build
npm run build:frontend
npm run build:backend
npm run test
npm run test:frontend
npm run test:backend
npm run lint
npm run lint:frontend
npm run lint:backend
npm run typecheck
```

The backend development watcher is restricted to `server/src/**/*.ts` so npm workspace dependencies in the root `node_modules/` directory do not exhaust Linux file watchers.

## Project Layout

```text
server/   Express API and MongoDB models
client/   Angular application
AGENTS/   Codex agent role guidance
docs/     Development guides and architecture documentation
SKILLS.md Codex reusable project skills
SYSTEM.md Codex project operating guide
```

## Documentation

Start with the [documentation index](docs/README.md). The guides cover:

- [Codex and AI project files](docs/01-estructura-ia-codex.md)
- [Monorepo and folder structure](docs/02-monorepo-estructura.md)
- [Backend CRUD, step by step](docs/03-crud-backend.md)
- [Frontend CRUD, step by step](docs/04-crud-frontend.md)
- [AI-generated descriptions with streaming](docs/05-ia-descripciones-streaming.md)

A combined Word version is available at
[mean-ai-documentacion.docx](docs/mean-ai-documentacion.docx).

## API

Health endpoint:

```text
GET /api/health
```

Inventory endpoints:

```text
GET    /api/product-categories
POST   /api/product-categories
GET    /api/product-categories/:id
PATCH  /api/product-categories/:id
DELETE /api/product-categories/:id

GET    /api/products
POST   /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
POST   /api/products/generate-description
```

The Angular inventory screens are available at:

```text
/products
/product-categories
```

Example response:

```json
{
  "data": {
    "status": "ok",
    "service": "mean_ai"
  },
  "meta": {},
  "error": null
}
```
