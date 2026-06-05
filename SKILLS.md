# SKILLS.md

This file describes reusable skills Codex can apply while developing this MEAN project.

Each skill should be treated as a capability with a clear trigger, expected actions, and verification path.

## Skill: Project Discovery

Use when starting any non-trivial task.

Actions:

- Inspect the repository structure with `rg --files`.
- Read relevant `package.json`, Angular, Express, and TypeScript config files.
- Identify existing conventions before editing.
- Check whether the work affects `client/`, `server/`, database models, or shared contracts.

Verification:

- Summarize the files and conventions that guided the change.

## Skill: Backend Feature

Use when adding or changing Express API behavior.

Actions:

- Add or update routes under `server/src/routes`.
- Keep request handling in controllers.
- Put business logic in services.
- Validate inputs before database writes.
- Use typed request and response shapes.
- Return consistent success and error JSON.
- Add tests for success, validation failure, and not-found cases when applicable.

Verification:

- Run server tests.
- Run server lint or typecheck when available.
- Manually inspect route registration if no automated tests exist.

## Skill: Angular Feature

Use when adding or changing client behavior.

Actions:

- Create focused Angular components.
- Put HTTP communication in Angular services.
- Keep interfaces close to the feature or in a shared model folder.
- Handle loading, empty, success, and error states.
- Preserve accessibility for forms, buttons, navigation, and dialogs.
- Keep responsive layout in mind for mobile and desktop.

Verification:

- Run Angular unit tests.
- Run client build or typecheck.
- Check the UI in a browser when visual behavior changed.

## Skill: MongoDB Model

Use when adding or changing persistence.

Actions:

- Define Mongoose schemas with explicit fields and validation.
- Add indexes for common lookup paths and uniqueness constraints.
- Avoid storing derived data unless there is a clear performance reason.
- Keep schema names, collection names, and API DTOs consistent.
- Plan migrations or compatibility behavior for existing data.

Verification:

- Add model tests when schema behavior is important.
- Test create, read, update, and delete paths that touch the model.

## Skill: Authentication And Authorization

Use when implementing login, sessions, tokens, roles, or protected routes.

Actions:

- Hash passwords with a proven password hashing library.
- Keep tokens and secrets in environment variables.
- Add authentication middleware for protected API routes.
- Add authorization checks close to the protected operation.
- Avoid leaking user existence or sensitive state through errors.
- Update frontend route guards and API error handling.

Verification:

- Test authenticated, unauthenticated, and unauthorized paths.
- Confirm secrets are not committed.

## Skill: API Contract

Use when client and server exchange new or changed data shapes.

Actions:

- Define explicit TypeScript interfaces or DTOs.
- Keep server response shapes stable.
- Update Angular services and consuming components together.
- Document breaking changes in the relevant docs.
- Add backward compatibility when existing clients may depend on the old shape.

Verification:

- Run server and client typechecks when available.
- Test at least one integrated request path.

## Skill: Testing

Use when adding coverage or fixing failing tests.

Actions:

- Reproduce the failure first when fixing tests.
- Prefer testing public behavior over implementation details.
- Add regression tests for fixed bugs.
- Keep fixtures small and readable.
- Avoid weakening assertions just to make tests pass.

Verification:

- Run the affected test file first.
- Run the broader test suite when the change touches shared behavior.

## Skill: Refactor

Use when improving code structure without changing behavior.

Actions:

- Confirm the current behavior before editing.
- Keep each refactor focused.
- Preserve public APIs unless the user asked for a breaking change.
- Move code in small steps and run tests between risky changes.
- Avoid mixing refactors with unrelated feature changes.

Verification:

- Run tests before and after when practical.
- Explain why behavior should be unchanged.

## Skill: Dev Environment

Use when changing setup, scripts, Docker, or environment variables.

Actions:

- Keep `.env.example` synchronized with required configuration.
- Prefer npm scripts for repeatable local commands.
- Keep Docker Compose services simple and named clearly.
- Document setup commands in `README.md`.
- Avoid binding services to surprising ports without documenting them.

Verification:

- Run or validate changed scripts.
- Confirm documented commands match actual package scripts.

## Skill: Code Review

Use when the user asks for review or risk assessment.

Actions:

- Read the diff and surrounding code.
- Prioritize correctness, regressions, security, and missing tests.
- Report findings first with file and line references.
- Keep summaries brief.

Verification:

- Run targeted tests only if useful and feasible.
