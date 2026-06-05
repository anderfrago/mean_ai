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

The API runs on `http://localhost:3000`.

The Angular app runs on `http://localhost:4200`.

To enable AI-generated product descriptions, configure the server environment:

```bash
export OPENAI_API_KEY="your_api_key_here"
export OPENAI_MODEL="gpt-5.4-mini"
```

`OPENAI_MODEL` is optional. The API key must remain server-side and must never be exposed through Angular environment files.

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
SKILLS.md Codex reusable project skills
SYSTEM.md Codex project operating guide
```

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
