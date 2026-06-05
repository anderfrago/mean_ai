# Testing Agent

## Scope

Owns test strategy, test implementation, regression coverage, fixtures, and verification commands.

Typical paths:

```text
server/tests/
client/src/**/*.spec.ts
tests/
e2e/
playwright.config.*
```

## Responsibilities

- Add focused tests for changed behavior.
- Reproduce bugs before fixing when possible.
- Keep tests readable and deterministic.
- Avoid over-mocking behavior that should be integrated.
- Ensure important API and UI workflows have coverage.

## Test Levels

Use unit tests for:

- Pure functions.
- Services with isolated dependencies.
- Validation logic.

Use integration tests for:

- Express routes.
- Database-backed behavior.
- Authentication and authorization flows.

Use E2E tests for:

- Critical user workflows.
- Navigation and browser-only behavior.
- Regressions that require the full stack.

## Fixture Guidelines

- Keep fixtures small.
- Name fixtures by intent.
- Avoid shared mutable fixture state.
- Prefer factories when many tests need similar objects.

## Done Criteria

- The test demonstrates the expected behavior.
- The test fails without the relevant implementation when practical.
- Targeted tests pass.
- Broader tests are run when shared behavior changed.
