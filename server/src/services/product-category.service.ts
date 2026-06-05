import { isValidObjectId } from "mongoose";

import { ProductCategoryModel } from "../models/product-category.model.js";
import { ProductModel } from "../models/product.model.js";
import { AppError } from "../utils/app-error.js";

export interface ProductCategoryInput {
  name: string;
  description?: string;
  requiresPrescription: boolean;
  active: boolean;
}

function assertValidId(id: string): void {
  if (!isValidObjectId(id)) {
    throw new AppError(400, "INVALID_ID", "Invalid product category id");
  }
}

export function listProductCategories() {
  return ProductCategoryModel.find().sort({ name: 1 }).lean();
}

export async function getProductCategory(id: string) {
  assertValidId(id);
  const category = await ProductCategoryModel.findById(id).lean();

  if (!category) {
    throw new AppError(404, "PRODUCT_CATEGORY_NOT_FOUND", "Product category not found");
  }

  return category;
}

export function createProductCategory(input: ProductCategoryInput) {
  return ProductCategoryModel.create(input);
}

export async function updateProductCategory(
  id: string,
  input: Partial<ProductCategoryInput>
) {
  assertValidId(id);
  const category = await ProductCategoryModel.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true
  }).lean();

  if (!category) {
    throw new AppError(404, "PRODUCT_CATEGORY_NOT_FOUND", "Product category not found");
  }

  return category;
}

export async function deleteProductCategory(id: string): Promise<void> {
  assertValidId(id);

  const productCount = await ProductModel.countDocuments({ productCategoryId: id });
  if (productCount > 0) {
    throw new AppError(
      409,
      "PRODUCT_CATEGORY_IN_USE",
      "Product category cannot be deleted while products use it",
      { productCount }
    );
  }

  const category = await ProductCategoryModel.findByIdAndDelete(id);
  if (!category) {
    throw new AppError(404, "PRODUCT_CATEGORY_NOT_FOUND", "Product category not found");
  }
}
