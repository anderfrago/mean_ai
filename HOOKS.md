# HOOKS.md

This file defines lifecycle hooks for Codex agents working in this MEAN monorepo.

Hooks are required checkpoints around development actions. They may be followed manually by an agent, implemented as Git hooks, or mapped to CI jobs.

## Hook Principles

- Run the narrowest check that covers the change.
- Do not run expensive full-suite checks after every small edit.
- Never modify or discard unrelated user changes.
- Stop and report failures that indicate a real regression.
- Explain checks that could not run because a service or tool was unavailable.
- Keep automated hooks non-destructive.

## 1. Session Start Hook

Trigger: At the beginning of a coding task.

All agents should:

```bash
git status --short
rg --files
```

Then inspect:

- `SYSTEM.md`
- The relevant file under `AGENTS/`
- `SKILLS.md`
- This `HOOKS.md`
- Relevant package and configuration files

Purpose:

- Detect existing user changes.
- Understand repository conventions.
- Select the correct agent responsibilities.

## 2. Pre-Edit Hook

Trigger: Before modifying files.

All agents should:

- Read the target files and nearby implementation.
- Identify affected contracts, tests, and documentation.
- Check whether the same behavior already has a local pattern.
- Confirm that planned edits stay within the requested scope.

Additional checks by agent:

| Agent | Pre-edit check |
| --- | --- |
| Backend | Trace route, controller, service, model, and error flow. |
| Frontend | Inspect routes, signals, Fetch services, Bootstrap patterns, and responsive states. |
| Database | Review schema, indexes, references, existing data compatibility, and delete rules. |
| Testing | Reproduce the failure or identify the behavior under test. |
| DevOps | Compare scripts, lockfile, environment examples, CI, and documentation. |
| Vet teacher | Confirm the lesson has a veterinary scenario and clear student objectives. |

## 3. Post-Edit Hook

Trigger: After a coherent group of file changes.

Run checks based on the affected area.

### Backend

```bash
npm run typecheck:backend
npm run lint:backend
npm run test:backend
```

Use targeted tests first when available.

### Frontend

```bash
npx tsc -p client/tsconfig.app.json --noEmit
npm run build:frontend
npm run test:frontend
```

Also verify:

- Mutable state uses `signal()`.
- Derived state uses `computed()`.
- API services use Fetch and typed promises.
- Requests check failed HTTP responses.
- Abortable reads use `AbortController` when appropriate.
- Standard UI uses Bootstrap classes.
- Loading, empty, error, and success states remain usable.

### Database

Run:

```bash
npm run typecheck:backend
npm run test:backend
```

Also verify:

- Required fields and defaults.
- Unique and lookup indexes.
- Reference integrity.
- Existing document compatibility.
- Safe behavior when deleting referenced records.

### Documentation

Check terminology and stale references:

```bash
rg -n "TODO|FIXME|product type|HttpClient|Observable" README.md SYSTEM.md SKILLS.md HOOKS.md AGENTS docs
```

Review matches rather than changing them automatically.

## 4. API Contract Hook

Trigger: When an endpoint, DTO, response shape, or error code changes.

The backend and frontend agents should:

- Update server validation and response types.
- Update client models and Fetch services.
- Check success and error payload handling.
- Update affected documentation.
- Build both workspaces.

```bash
npm run build
```

## 5. Dependency Change Hook

Trigger: When a package dependency or version changes.

The DevOps agent should:

- Install from the repository root.
- Keep `package-lock.json` synchronized.
- Confirm dependencies remain hoisted to root `node_modules/`.
- Check official compatibility requirements.
- Run affected builds and tests.
- Review audit output without applying forced breaking upgrades automatically.

```bash
npm install
npm run build
npm test
```

## 6. Database Schema Hook

Trigger: When a Mongoose schema, index, relationship, or persisted field changes.

The database and backend agents should answer:

1. Are old documents still valid?
2. Is a migration required?
3. Does the API accept and return the new shape?
4. Do indexes support expected queries?
5. What happens to referenced records on update or deletion?

For non-trivial changes, add:

- A migration script.
- A documented command.
- Rollback or recovery notes.

## 7. UI Workflow Hook

Trigger: When an Angular screen or interaction changes.

The frontend agent should verify:

- Desktop and mobile layout.
- Keyboard navigation and visible labels.
- Form validation and disabled states.
- Fetch loading and error behavior.
- Empty lists and filtered-empty results.
- Bootstrap styles are loaded in development, tests, and production.
- Text and controls do not overlap or overflow.

For important workflows, add or update an Angular or E2E test.

## 8. AI Integration Hook

Trigger: When adding or changing OpenAI-backed behavior.

The backend, frontend, and testing agents should verify:

- `OPENAI_API_KEY` is read only by the server.
- The model is configurable with `OPENAI_MODEL`.
- Prompt inputs are validated and minimized.
- Output length and veterinary claims are constrained.
- Responses API text deltas are streamed progressively.
- Browser and server cancellation stop unnecessary work.
- Missing configuration returns a safe, explicit error.
- Tests mock streams and do not spend API credits.
- `.env.example`, README, and relevant lessons are updated.

## 9. Teaching Documentation Hook

Trigger: When creating or changing a lesson under `docs/`.

The veterinary web teacher agent should verify:

- The learning objective is explicit.
- The veterinary scenario is realistic.
- Technical vocabulary is introduced before use.
- Steps follow database, backend, frontend, and testing order.
- Safety or prescription concerns are identified where relevant.
- Students receive checkpoints, exercises, and review questions.
- Examples match the current repository implementation.

## 10. Pre-Commit Hook

Trigger: Before creating a commit.

Always inspect:

```bash
git status --short
git diff --check
git diff --stat
```

Recommended minimum:

```bash
npm run build
npm run lint
npm test
```

If the full suite cannot run, execute the affected workspace checks and state the limitation.

Do not commit:

- `.env` or credentials.
- Build output.
- Temporary verification data.
- Unrelated user changes.

## 11. Pre-Finish Hook

Trigger: Before reporting a task as complete.

The active agent should:

- Re-read the latest user request.
- Confirm every requested behavior was implemented.
- Run final targeted verification.
- Check `git status --short`.
- Report files changed, checks run, and any remaining limitation.
- Keep required development servers running when the user is actively testing them.

## Recommended Automation

These hooks are the best candidates for actual automation:

| Automation point | Recommended checks |
| --- | --- |
| Pre-commit | `git diff --check`, affected typecheck, affected lint. |
| Pre-push | Full build and test suites. |
| Pull request CI | Clean install, typecheck, lint, tests, production build. |
| Dependency update CI | Lockfile validation, audit report, full build and tests. |
| Schema change review | Migration checklist and backend tests. |

Avoid putting slow browser tests or Docker-dependent integration tests in pre-commit. Run them in pre-push or CI so normal development remains responsive.
