import { isValidObjectId } from "mongoose";

import { ProductCategoryModel } from "../models/product-category.model.js";
import { ProductModel } from "../models/product.model.js";
import { AppError } from "../utils/app-error.js";

export interface ProductInput {
  name: string;
  sku: string;
  productCategoryId: string;
  description?: string;
  unitPrice: number;
  stockQuantity: number;
  minimumStock: number;
  expirationDate?: Date;
  active: boolean;
}

function assertValidId(id: string, resource: string): void {
  if (!isValidObjectId(id)) {
    throw new AppError(400, "INVALID_ID", `Invalid ${resource} id`);
  }
}

async function assertCategoryExists(productCategoryId: string): Promise<void> {
  assertValidId(productCategoryId, "product category");
  const exists = await ProductCategoryModel.exists({ _id: productCategoryId });

  if (!exists) {
    throw new AppError(400, "INVALID_PRODUCT_CATEGORY", "Product category does not exist");
  }
}

export function listProducts(productCategoryId?: string) {
  const filter: Record<string, unknown> = {};

  if (productCategoryId) {
    assertValidId(productCategoryId, "product category");
    filter["productCategoryId"] = productCategoryId;
  }

  return ProductModel.find(filter)
    .populate("productCategoryId", "name requiresPrescription active")
    .sort({ name: 1 })
    .lean();
}

export async function getProduct(id: string) {
  assertValidId(id, "product");
  const product = await ProductModel.findById(id)
    .populate("productCategoryId", "name requiresPrescription active")
    .lean();

  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }

  return product;
}

export async function createProduct(input: ProductInput) {
  await assertCategoryExists(input.productCategoryId);
  return ProductModel.create(input);
}

export async function updateProduct(id: string, input: Partial<ProductInput>) {
  assertValidId(id, "product");

  if (input.productCategoryId) {
    await assertCategoryExists(input.productCategoryId);
  }

  const product = await ProductModel.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true
  })
    .populate("productCategoryId", "name requiresPrescription active")
    .lean();

  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }

  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  assertValidId(id, "product");
  const product = await ProductModel.findByIdAndDelete(id);

  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", "Product not found");
  }
}
