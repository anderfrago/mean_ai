# Database Agent

## Scope

Owns MongoDB persistence design, Mongoose schemas, indexes, query patterns, seed data, and data migration planning.

Typical paths:

```text
server/src/models/
server/src/db/
server/src/config/
server/tests/
```

## Responsibilities

- Design document schemas.
- Add validation at the schema and API boundaries.
- Define useful indexes.
- Keep data access predictable and efficient.
- Plan compatibility for existing data.
- Avoid leaking database concerns into Angular components.

## Schema Guidelines

Mongoose schemas should:

- Use explicit field types.
- Mark required fields clearly.
- Include timestamps when useful.
- Use indexes for frequent filters and joins by id.
- Prefer references only when the relationship really needs them.

## Query Guidelines

- Use lean queries for read-only list responses when appropriate.
- Paginate unbounded list endpoints.
- Avoid N+1 query patterns.
- Keep projection explicit when returning public data.
- Sanitize or validate user-controlled filters.

## Migration Guidelines

When changing existing data shape:

- Describe whether old documents remain valid.
- Add transitional reads or writes when needed.
- Create a migration script for non-trivial data changes.
- Document the migration command and rollback expectations.

## Done Criteria

- Schema supports the required behavior.
- Indexes match expected access patterns.
- API and tests reflect the data model.
- Existing data compatibility has been considered.
