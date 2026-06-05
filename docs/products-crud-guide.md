# Products And Product Types CRUD Guide

## 1. Learning Objective

In this lesson, students will learn how to generate a complete CRUD workflow in a MEAN stack application for:

- Products.
- Product types.

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

Each product belongs to a product type.

Example product types:

- Medication.
- Food.
- Hygiene.
- Equipment.
- Accessory.
- Clinical supply.

This separation is useful because the clinic can filter products, apply safety rules, and organize stock more clearly.

## 3. Data Model

Start with two MongoDB collections:

```text
product_types
products
```

### Product Type

Suggested fields:

```ts
interface ProductType {
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
  productTypeId: string;
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
  "productTypeId": "PRODUCT_TYPE_ID",
  "unitPrice": 35.5,
  "stockQuantity": 20,
  "minimumStock": 5,
  "expirationDate": "2027-03-15",
  "active": true
}
```

## 4. Backend API

Create REST endpoints under `/api`.

### Product Types Endpoints

```text
GET    /api/product-types
POST   /api/product-types
GET    /api/product-types/:id
PATCH  /api/product-types/:id
DELETE /api/product-types/:id
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
server/src/models/product-type.model.ts
server/src/models/product.model.ts
server/src/services/product-type.service.ts
server/src/services/product.service.ts
server/src/controllers/product-type.controller.ts
server/src/controllers/product.controller.ts
server/src/routes/product-type.routes.ts
server/src/routes/product.routes.ts
```

### Backend Implementation Steps

1. Create the Mongoose schema for `ProductType`.
2. Create the Mongoose schema for `Product`.
3. Add indexes for fields commonly searched:

```text
ProductType.name
Product.sku
Product.name
Product.productTypeId
```

4. Create validation schemas for request bodies.
5. Create service functions for database operations.
6. Create controller functions for HTTP behavior.
7. Register routes in `server/src/routes/index.ts`.
8. Add error handling for invalid IDs, duplicate SKUs, and missing records.

## 5. Validation Rules

Product type validation:

- `name` is required.
- `name` should be unique.
- `requiresPrescription` defaults to `false`.
- `active` defaults to `true`.

Product validation:

- `name` is required.
- `sku` is required and unique.
- `productTypeId` must reference an existing product type.
- `unitPrice` must be greater than or equal to `0`.
- `stockQuantity` must be greater than or equal to `0`.
- `minimumStock` must be greater than or equal to `0`.
- `expirationDate` is optional.

Veterinary safety rule:

- If a product belongs to a type that requires prescription, the UI should clearly show that status.

## 6. Angular UI

Create two feature areas:

```text
client/src/app/features/product-types/
client/src/app/features/products/
```

Recommended files:

```text
product-types/
├── product-type-list.component.ts
├── product-type-form.component.ts
├── product-type.service.ts
└── product-type.model.ts

products/
├── product-list.component.ts
├── product-form.component.ts
├── product.service.ts
└── product.model.ts
```

### Product Types Screen

The product types screen should allow clinic staff to:

- View all product types.
- Create a new product type.
- Edit an existing product type.
- Disable or delete a product type.

Useful table columns:

- Name.
- Requires prescription.
- Active.
- Actions.

### Products Screen

The products screen should allow clinic staff to:

- View all products.
- Filter by product type.
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

1. Define TypeScript interfaces for product types and products.
2. Create Angular services using `HttpClient`.
3. Add methods for list, get by id, create, update, and delete.
4. Create list components with loading, empty, error, and ready states.
5. Create form components using reactive forms.
6. Add validators to match backend rules.
7. Add routes for product and product type screens.
8. Connect form submit actions to the API services.
9. Refresh the list after create, update, or delete.

## 8. Testing Checklist

Backend tests:

- Can create a product type.
- Cannot create duplicate product type names.
- Can list product types.
- Can update a product type.
- Can create a product linked to a product type.
- Cannot create a product with an invalid product type.
- Cannot create duplicate SKUs.
- Can update stock quantity.
- Can delete or deactivate a product.

Frontend tests:

- Product type form validates required fields.
- Product form validates price and stock numbers.
- Product list shows empty state.
- Product list shows API error state.
- Product service calls the expected endpoints.

Manual checks:

- Start MongoDB.
- Start backend.
- Start frontend.
- Create a product type named `Medication`.
- Create a product assigned to `Medication`.
- Confirm the product appears in the list.
- Edit the stock quantity.
- Delete or deactivate the product.

## 9. Common Student Mistakes

- Creating products before product types exist.
- Forgetting to validate numeric fields.
- Using product type names instead of IDs in the product document.
- Putting API calls directly inside many components instead of using a service.
- Not handling loading or error states in Angular.
- Hard-coding API URLs in multiple places.
- Deleting product types that are still used by products without a clear rule.

## 10. Classroom Exercise

Build the first version with only these fields:

Product type:

- Name.
- Requires prescription.

Product:

- Name.
- SKU.
- Product type.
- Unit price.
- Stock quantity.

After that version works, add:

- Minimum stock.
- Expiration date.
- Active status.
- Product filtering by type.
- Low-stock warning.

## 11. Review Questions

1. Why do we separate products from product types?
2. Why should `sku` be unique?
3. What validation should happen in the backend even if Angular already validates the form?
4. What should happen if a product type is deleted while products still use it?
5. Why is an Angular service a better place for HTTP calls than a component?

## 12. Suggested Development Order

Use this order during implementation:

```text
1. ProductType model
2. ProductType API
3. ProductType Angular service
4. ProductType list and form
5. Product model
6. Product API
7. Product Angular service
8. Product list and form
9. Filtering and low-stock UI
10. Tests and cleanup
```

This order helps students build the simpler catalog first, then use that catalog when creating products.
