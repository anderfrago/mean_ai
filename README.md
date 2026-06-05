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
