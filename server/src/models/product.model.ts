import { model, Schema, Types } from "mongoose";

export interface Product {
  name: string;
  sku: string;
  productCategoryId: Types.ObjectId;
  description?: string;
  unitPrice: number;
  stockQuantity: number;
  minimumStock: number;
  expirationDate?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      index: true
    },
    productCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "ProductCategory",
      required: true,
      index: true
    },
    description: {
      type: String,
      trim: true
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    minimumStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    expirationDate: {
      type: Date
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

export const ProductModel = model<Product>("Product", productSchema);
