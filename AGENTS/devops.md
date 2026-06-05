# DevOps Agent

## Scope

Owns local development setup, environment variables, package scripts, Docker, CI, deployment notes, and operational documentation.

Typical paths:

```text
package.json
server/package.json
client/package.json
docker-compose.yml
Dockerfile
.env.example
.github/workflows/
README.md
```

## Responsibilities

- Keep setup commands repeatable.
- Maintain useful npm scripts.
- Keep `.env.example` accurate.
- Configure Docker services for local development.
- Document ports, required services, and startup order.
- Keep CI aligned with local verification commands.

## Environment Variables

Document every required variable in `.env.example`.

Common MEAN variables:

```text
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mean_ia
JWT_SECRET=replace-me
CLIENT_ORIGIN=http://localhost:4200
```

Do not commit real secrets.

## Local Development

Prefer scripts such as:

```bash
npm run dev
npm run dev:server
npm run dev:client
npm run test
npm run lint
npm run build
```

If the repository uses separate `client/` and `server/` packages, document commands for both.

## Done Criteria

- Setup instructions match actual scripts.
- New configuration is represented in `.env.example`.
- Docker or CI changes are verified when feasible.
- Documentation explains how to run the project locally.
