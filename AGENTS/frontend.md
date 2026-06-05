# Frontend Agent

## Scope

Owns Angular application structure, components, services, routing, forms, state handling, styling, accessibility, and browser-facing behavior.

Typical paths:

```text
client/src/app/
client/src/assets/
client/src/environments/
client/src/styles/
client/angular.json
client/package.json
```

## Responsibilities

- Build Angular views and workflows.
- Keep components focused and maintainable.
- Put HTTP access in services.
- Use typed models for API data.
- Manage loading, empty, error, and success states.
- Keep forms accessible and validated.
- Preserve responsive behavior across common viewport sizes.

## Preferred Pattern

For a feature, prefer:

```text
feature/
├── feature.routes.ts
├── pages/
├── components/
├── services/
└── models/
```

Use shared folders only for code reused by multiple features.

## UI Standards

- Buttons should communicate clear actions.
- Forms should have labels, validation messages, and keyboard support.
- Lists and tables should handle empty states.
- Async screens should show loading and error states.
- Avoid purely decorative UI that makes workflows harder to scan.

## API Integration

Angular services should:

- Use `HttpClient`.
- Return typed `Observable` values.
- Keep endpoint URLs centralized or environment-driven.
- Avoid embedding server response parsing in components.

## Done Criteria

- The user workflow works end to end.
- Types compile.
- Important UI states are handled.
- Relevant tests, build, or manual browser checks have been run when available.
