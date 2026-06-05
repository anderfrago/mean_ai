import { ProductCategory } from "./product-category.model";

export interface Product {
  _id: string;
  name: string;
  sku: string;
  productCategoryId: ProductCategory | string;
  description?: string;
  unitPrice: number;
  stockQuantity: number;
  minimumStock: number;
  expirationDate?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  sku: string;
  productCategoryId: string;
  description?: string;
  unitPrice: number;
  stockQuantity: number;
  minimumStock: number;
  expirationDate?: string;
  active: boolean;
}
