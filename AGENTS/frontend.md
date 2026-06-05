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
- Use Angular signals as the default state-management primitive.
- Use Bootstrap components and utility classes as the default UI toolkit.
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

- Prefer Bootstrap layout, spacing, forms, tables, alerts, badges, and buttons.
- Add custom CSS only for domain-specific layout or styling not covered by Bootstrap.
- Buttons should communicate clear actions.
- Forms should have labels, validation messages, and keyboard support.
- Lists and tables should handle empty states.
- Async screens should show loading and error states.
- Avoid purely decorative UI that makes workflows harder to scan.

## API Integration

Angular services should:

- Use the browser Fetch API instead of Angular `HttpClient`.
- Return typed `Promise` values.
- Check `response.ok` and translate failed responses into useful typed errors.
- Use `AbortController` when requests may need cancellation.
- Decode streamed text incrementally from `ReadableStream`.
- Keep endpoint URLs centralized or environment-driven.
- Avoid embedding server response parsing in components.

## Signals And State

Angular components and services should:

- Use `signal()` for mutable application and view state.
- Use `computed()` for values derived from other signals.
- Use `effect()` only for genuine side effects, not routine state derivation.
- Expose readonly signals from services when state should not be mutated externally.
- Represent loading, error, empty, and ready states explicitly.
- Update signal state after awaited Fetch API operations.
- Avoid RxJS `Observable`, `Subject`, and manual subscriptions unless integration with an existing observable API makes them necessary.
- Avoid converting Fetch promises into observables without a clear technical reason.

## Done Criteria

- The user workflow works end to end.
- Types compile.
- State is implemented with signals and API access uses Fetch.
- Important UI states are handled.
- Relevant tests, build, or manual browser checks have been run when available.
