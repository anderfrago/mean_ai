# SYSTEM.md

## Project

This repository is a MEAN stack application intended to be developed with Codex.

MEAN means:

- MongoDB for persistence.
- Express for the HTTP API.
- Angular for the frontend.
- Node.js for server runtime, tooling, and scripts.

Codex should treat this file as the project-level operating guide. More specific guidance lives in `AGENTS/*.md` and reusable capabilities live in `SKILLS.md`.
Lifecycle checkpoints shared by all agents live in `HOOKS.md`.

## Expected Repository Shape

Use this structure unless the project already contains a different established layout:

```text
.
├── SYSTEM.md
├── SKILLS.md
├── HOOKS.md
├── AGENTS/
│   ├── backend.md
│   ├── frontend.md
│   ├── database.md
│   ├── testing.md
│   ├── devops.md
│   └── vet-web-teacher.md
├── docs/
│   └── products-crud-guide.md
├── server/
│   ├── src/
│   │   ├── app.ts
│   │   ├── main.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── package.json
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── environments/
│   │   └── styles/
│   ├── angular.json
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Codex Behavior

When working in this repository, Codex should:

- Inspect the existing code before making assumptions.
- Prefer the conventions already present in the repository.
- Keep changes small, reviewable, and tied to the user request.
- Avoid broad rewrites unless explicitly requested.
- Protect user changes and never revert unrelated work.
- Update docs or examples when changing developer-facing behavior.
- Add or update tests when behavior changes.
- Run the narrowest useful verification command before finishing.

## Engineering Defaults

Use TypeScript for both server and client code.

Prefer:

- Express routers grouped by resource.
- Controller functions kept thin.
- Services for business logic.
- Mongoose models and schemas for MongoDB documents.
- Environment-driven configuration.
- Angular standalone components when the project uses modern Angular.
- Angular signals for application and view state.
- Browser Fetch API services returning typed promises.
- Bootstrap for standard layout, forms, tables, navigation, and UI components.
- Explicit DTOs or interfaces for API request and response shapes.

Avoid:

- Hard-coded secrets.
- Business logic in route declarations.
- MongoDB access directly from Angular.
- Large untyped `any` surfaces.
- Global mutable state unless there is a clear reason.
- Adding new frameworks when the current stack can solve the problem.

## Security

All server changes must consider:

- Input validation.
- Authentication and authorization boundaries.
- Rate limits for sensitive endpoints.
- Safe error messages that do not leak internals.
- Secure password handling with hashing.
- Environment-based secret configuration.
- CORS rules that match the deployment model.
- Third-party API keys remaining server-side.

Never commit real credentials. Use `.env.example` for documented placeholders.

OpenAI integrations should use the official server SDK and Responses API. Never expose `OPENAI_API_KEY` through Angular code or environment files.

## API Conventions

Prefer RESTful resource paths:

```text
GET    /api/items
POST   /api/items
GET    /api/items/:id
PATCH  /api/items/:id
DELETE /api/items/:id
```

For responses, prefer predictable JSON:

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

For errors, prefer:

```json
{
  "data": null,
  "meta": {},
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": {}
  }
}
```

## Frontend Conventions

Angular code should:

- Keep components focused on presentation and interaction.
- Put API calls in services.
- Use typed interfaces for server data.
- Use route-level lazy loading for larger features.
- Keep templates accessible and keyboard-friendly.
- Use reactive forms for non-trivial forms.
- Keep styling local unless it is truly global.

## Testing Expectations

Use the test tools already configured in the project. If none exist yet, prefer:

- Server unit and integration tests with Jest or Vitest plus Supertest.
- Angular unit tests with the Angular test runner already configured by the CLI.
- E2E tests with Playwright when user flows matter.

Tests should cover:

- Core business logic.
- API success and failure cases.
- Validation and authorization boundaries.
- Angular component behavior for important user workflows.

## Verification Checklist

Before finishing a coding task, Codex should try to verify with one or more of:

```bash
npm test
npm run test
npm run lint
npm run build
npm run typecheck
```

If the repository has separate apps, run the relevant commands from `server/` or `client/`.

If verification cannot be run, explain why clearly.

## Documentation

Keep documentation practical. Prefer examples, commands, and conventions that help the next developer move faster.

Update:

- `README.md` when setup or runtime behavior changes.
- `.env.example` when configuration changes.
- `SYSTEM.md`, `SKILLS.md`, or `AGENTS/*.md` when Codex workflow expectations change.
- `HOOKS.md` when agent lifecycle checks or automation expectations change.
