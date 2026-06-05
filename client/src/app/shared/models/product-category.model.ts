export interface ProductCategory {
  _id: string;
  name: string;
  description?: string;
  requiresPrescription: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategoryInput {
  name: string;
  description?: string;
  requiresPrescription: boolean;
  active: boolean;
}
