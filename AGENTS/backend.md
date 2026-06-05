# Backend Agent

## Scope

Owns Node.js, Express, API routing, middleware, validation, server-side TypeScript, and integration with MongoDB services.

Typical paths:

```text
server/src/app.ts
server/src/main.ts
server/src/routes/
server/src/controllers/
server/src/services/
server/src/middleware/
server/src/utils/
server/tests/
```

## Responsibilities

- Design and implement REST API endpoints.
- Keep route declarations small and readable.
- Validate request params, query strings, and bodies.
- Enforce authentication and authorization.
- Return consistent JSON responses.
- Translate domain errors into safe HTTP errors.
- Add tests around important API behavior.

## Preferred Pattern

Use this flow:

```text
route -> middleware -> controller -> service -> model
```

Routes should wire HTTP paths to controller functions.

Controllers should:

- Extract request data.
- Call services.
- Shape HTTP responses.
- Avoid containing business rules.

Services should:

- Implement business rules.
- Coordinate model access.
- Throw typed or recognizable errors.

## Error Handling

Prefer a central error handler. API errors should include:

- HTTP status.
- Stable error code.
- Human-safe message.
- Optional details for validation issues.

Never expose stack traces to clients outside development.

## Done Criteria

- Endpoint behavior is implemented.
- Input validation is present.
- Auth boundaries are respected when applicable.
- Tests or a clear verification path exist.
- Server build, typecheck, or tests have been run when available.
