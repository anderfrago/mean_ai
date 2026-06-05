# Products And Product Categories CRUD Guide

## 1. Learning Objective

In this lesson, students will learn how to generate a complete CRUD workflow in a MEAN stack application for:

- Products.
- Product categories.

CRUD means:

- Create new records.
- Read or list records.
- Update existing records.
- Delete records.

By the end, students should understand how a veterinary clinic inventory feature moves from database model to API endpoint to Angular screen.

## 2. Veterinary Scenario

Imagine a veterinary clinic that needs to manage its internal inventory.

The clinic stores products such as:

- Vaccines.
- Antibiotics.
- Food bags.
- Shampoo.
- Collars.
- Syringes.
- Bandages.

Each product belongs to a product category.

Example product categories:

- Medication.
- Food.
- Hygiene.
- Equipment.
- Accessory.
- Clinical supply.

This separation is useful because the clinic can filter products, apply safety rules, and organize stock more clearly. In some systems, the same concept may be called a product type.

## 3. Data Model

Start with two MongoDB collections:

```text
product_categories
products
```

### Product Category

Suggested fields:

```ts
interface ProductCategory {
  _id: string;
  name: string;
  description?: string;
  requiresPrescription: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
```

Example:

```json
{
  "name": "Medication",
  "description": "Products used for treatment or prevention",
  "requiresPrescription": true,
  "active": true
}
```

### Product

Suggested fields:

```ts
interface Product {
  _id: string;
  name: string;
  sku: string;
  productCategoryId: string;
  description?: string;
  unitPrice: number;
  stockQuantity: number;
  minimumStock: number;
  expirationDate?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
```

Example:

```json
{
  "name": "Canine vaccine V10",
  "sku": "VAC-CAN-V10",
  "productCategoryId": "PRODUCT_CATEGORY_ID",
  "unitPrice": 35.5,
  "stockQuantity": 20,
  "minimumStock": 5,
  "expirationDate": "2027-03-15",
  "active": true
}
```

## 4. Backend API

Create REST endpoints under `/api`.

### Product Categories Endpoints

```text
GET    /api/product-categories
POST   /api/product-categories
GET    /api/product-categories/:id
PATCH  /api/product-categories/:id
DELETE /api/product-categories/:id
```

### Products Endpoints

```text
GET    /api/products
POST   /api/products
GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id
```

### Backend File Plan

Use this structure:

```text
server/src/models/product-category.model.ts
server/src/models/product.model.ts
server/src/services/product-category.service.ts
server/src/services/product.service.ts
server/src/controllers/product-category.controller.ts
server/src/controllers/product.controller.ts
server/src/routes/product-category.routes.ts
server/src/routes/product.routes.ts
```

### Backend Implementation Steps

1. Create the Mongoose schema for `ProductCategory`.
2. Create the Mongoose schema for `Product`.
3. Add indexes for fields commonly searched:

```text
ProductCategory.name
Product.sku
Product.name
Product.productCategoryId
```

4. Create validation schemas for request bodies.
5. Create service functions for database operations.
6. Create controller functions for HTTP behavior.
7. Register routes in `server/src/routes/index.ts`.
8. Add error handling for invalid IDs, duplicate SKUs, and missing records.

## 5. Validation Rules

Product category validation:

- `name` is required.
- `name` should be unique.
- `requiresPrescription` defaults to `false`.
- `active` defaults to `true`.

Product validation:

- `name` is required.
- `sku` is required and unique.
- `productCategoryId` must reference an existing product category.
- `unitPrice` must be greater than or equal to `0`.
- `stockQuantity` must be greater than or equal to `0`.
- `minimumStock` must be greater than or equal to `0`.
- `expirationDate` is optional.

Veterinary safety rule:

- If a product belongs to a category that requires prescription, the UI should clearly show that status.

## 6. Angular UI

Create two feature areas:

```text
client/src/app/features/product-categories/
client/src/app/features/products/
```

Recommended files:

```text
product-categories/
├── product-categories.component.ts
├── product-categories.component.html
├── product-category.service.ts
└── product-category.model.ts

products/
├── product-list.component.ts
├── product-form.component.ts
├── product.service.ts
└── product.model.ts
```

### Product Categories Screen

The product categories screen should allow clinic staff to:

- View all product categories.
- Create a new product category.
- Edit an existing product category.
- Disable or delete a product category.

Useful table columns:

- Name.
- Requires prescription.
- Active.
- Actions.

### Products Screen

The products screen should allow clinic staff to:

- View all products.
- Filter by product category.
- Create a product.
- Edit a product.
- Delete or deactivate a product.
- Identify low-stock products.

Useful table columns:

- Name.
- SKU.
- Type.
- Unit price.
- Stock.
- Minimum stock.
- Expiration date.
- Actions.

## 7. Angular Implementation Steps

1. Define TypeScript interfaces for product categories and products.
2. Create Angular services using the browser Fetch API and typed promises.
3. Add methods for list, get by id, create, update, and delete.
4. Create list components with Angular signals for loading, empty, error, and ready states.
5. Create form components using reactive forms.
6. Add validators to match backend rules.
7. Add routes for product and product category screens.
8. Connect form submit actions to the API services.
9. Refresh the list after create, update, or delete.
10. Use Bootstrap classes for forms, tables, alerts, badges, buttons, and responsive layout.
11. Keep the description field hidden initially and reveal it when AI generation starts.
12. Read the generated description incrementally from a Fetch response stream.

### AI Description Generation

The Angular product form sends the product name, SKU, category, and prescription status to:

```text
POST /api/products/generate-description
```

The Express server calls the OpenAI Responses API with streaming enabled. It forwards NDJSON events to Angular:

```json
{"type":"delta","text":"Generated text"}
{"type":"done"}
{"type":"error","message":"Safe error message"}
```

This framing lets the UI distinguish generated text from provider errors without breaking the chunked HTTP response.

Security rules:

- Store `OPENAI_API_KEY` only on the server.
- Never add the API key to Angular environment files.
- Validate product context before calling OpenAI.
- Limit generated output length.
- Do not request or invent dosage, efficacy, contraindication, or regulatory claims.
- Allow the browser to cancel generation with `AbortController`.

## 8. Testing Checklist

Backend tests:

- Can create a product category.
- Cannot create duplicate product category names.
- Can list product categories.
- Can update a product category.
- Can create a product linked to a product category.
- Cannot create a product with an invalid product category.
- Cannot create duplicate SKUs.
- Can update stock quantity.
- Can delete or deactivate a product.

Frontend tests:

- Product category form validates required fields.
- Product form validates price and stock numbers.
- Product list shows empty state.
- Product list shows API error state.
- Fetch services call the expected endpoints and handle failed HTTP responses.
- Signal state changes correctly for loading, success, empty, and error states.
- Bootstrap classes render forms, tables, alerts, badges, and actions correctly.

Manual checks:

- Start MongoDB.
- Start backend.
- Start frontend.
- Create a product category named `Medication`.
- Create a product assigned to `Medication`.
- Confirm the product appears in the list.
- Edit the stock quantity.
- Delete or deactivate the product.

## 9. Common Student Mistakes

- Creating products before product categories exist.
- Forgetting to validate numeric fields.
- Using product category names instead of IDs in the product document.
- Putting API calls directly inside many components instead of using a service.
- Using `HttpClient` or RxJS observables instead of the project Fetch and promise pattern.
- Storing mutable component state in plain properties instead of Angular signals.
- Using `effect()` for values that should be implemented with `computed()`.
- Not handling loading or error states in Angular.
- Hard-coding API URLs in multiple places.
- Recreating Bootstrap components with unnecessary custom CSS.
- Deleting product categories that are still used by products without a clear rule.

## 10. Classroom Exercise

Build the first version with only these fields:

Product category:

- Name.
- Requires prescription.

Product:

- Name.
- SKU.
- Product category.
- Unit price.
- Stock quantity.

After that version works, add:

- Minimum stock.
- Expiration date.
- Active status.
- Product filtering by category.
- Low-stock warning.

## 11. Review Questions

1. Why do we separate products from product categories?
2. Why should `sku` be unique?
3. What validation should happen in the backend even if Angular already validates the form?
4. What should happen if a product category is deleted while products still use it?
5. Why is an Angular service a better place for HTTP calls than a component?

## 12. Suggested Development Order

Use this order during implementation:

```text
1. ProductCategory model
2. ProductCategory API
3. ProductCategory Angular service
4. ProductCategory list and form
5. Product model
6. Product API
7. Product Angular service
8. Product list and form
9. Filtering and low-stock UI
10. Tests and cleanup
```

This order helps students build the simpler catalog first, then use that catalog when creating products.

## 13. Agent Hook Workflow

The project hook definitions live in [`HOOKS.md`](../HOOKS.md). Use the following checkpoints while completing this lesson.

### Session Start

Before changing code:

```bash
git status --short
rg --files
```

Read:

- `SYSTEM.md`
- `AGENTS/backend.md`
- `AGENTS/frontend.md`
- `AGENTS/database.md`
- `AGENTS/testing.md`
- `AGENTS/vet-web-teacher.md`
- `HOOKS.md`

Checkpoint:

- Existing user changes are understood.
- The current API, Angular, database, and UI patterns have been inspected.

### After Product Category Backend

Run:

```bash
npm run typecheck:backend
npm run lint:backend
npm run test:backend
```

Confirm:

- Category names are unique.
- Request bodies are validated.
- API errors use the standard response format.
- Categories used by products cannot be deleted.

### After Product Backend

Run the backend checks again.

Confirm:

- SKUs are unique.
- Numeric values cannot be negative.
- The selected category exists.
- Product lists populate category information.
- Category filtering works.

### After Angular Fetch Services

Run:

```bash
npx tsc -p client/tsconfig.app.json --noEmit
npm run build:frontend
```

Confirm:

- Services use the browser Fetch API.
- Methods return typed promises.
- Failed HTTP responses throw useful errors.
- API URLs come from the environment configuration.
- List requests can be cancelled with `AbortController`.

### After Angular Screens

Run:

```bash
npm run test:frontend
npm run build:frontend
```

Confirm:

- Mutable state uses `signal()`.
- Derived counts and state use `computed()`.
- Loading, empty, error, and success states are visible.
- Forms use reactive validation.
- Bootstrap is loaded in development, tests, and production builds.
- Tables and forms remain usable on mobile widths.

### API Contract Check

Whenever a request or response field changes:

1. Update the Mongoose schema.
2. Update server validation and service logic.
3. Update the Angular interface.
4. Update the Fetch service.
5. Update the form and template.
6. Update this guide.
7. Run the full build.

```bash
npm run build
```

### Live CRUD Check

With MongoDB, backend, and frontend running:

1. Create a category named `Medication`.
2. Create a product assigned to `Medication`.
3. Filter the product list by that category.
4. Edit its price and stock.
5. Confirm low-stock styling appears when stock reaches the minimum.
6. Confirm the prescription badge appears when required.
7. Delete the product.
8. Delete the category.

Do not leave temporary verification records in the database.

### Before Commit

Run:

```bash
git diff --check
npm run build
npm run lint
npm test
git status --short
```

The commit should not include credentials, generated build output, temporary data, or unrelated user changes.
