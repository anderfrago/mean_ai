import { ProductCategoryModel } from "../src/models/product-category.model.js";
import { ProductModel } from "../src/models/product.model.js";

describe("product models", () => {
  it("applies product category defaults", () => {
    const category = new ProductCategoryModel({ name: "Medication" });

    expect(category.requiresPrescription).toBe(false);
    expect(category.active).toBe(true);
  });

  it("rejects negative product inventory values", async () => {
    const product = new ProductModel({
      name: "Canine vaccine",
      sku: "VAC-CAN-01",
      productCategoryId: "507f1f77bcf86cd799439011",
      unitPrice: -1,
      stockQuantity: -1,
      minimumStock: -1
    });

    await expect(product.validate()).rejects.toMatchObject({
      name: "ValidationError"
    });
  });
});
