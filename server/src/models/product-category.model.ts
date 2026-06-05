import { model, Schema } from "mongoose";

export interface ProductCategory {
  name: string;
  description?: string;
  requiresPrescription: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productCategorySchema = new Schema<ProductCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    requiresPrescription: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const ProductCategoryModel = model<ProductCategory>(
  "ProductCategory",
  productCategorySchema
);
