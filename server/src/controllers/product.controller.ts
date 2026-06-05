import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct
} from "../services/product.service.js";
import { ok } from "../utils/api-response.js";

const productSchema = z.object({
  name: z.string().trim().min(2).max(150),
  sku: z.string().trim().min(2).max(50).transform((value) => value.toUpperCase()),
  productCategoryId: z.string().trim().min(1),
  description: z.string().trim().max(1000).optional(),
  unitPrice: z.coerce.number().min(0),
  stockQuantity: z.coerce.number().int().min(0),
  minimumStock: z.coerce.number().int().min(0),
  expirationDate: z.coerce.date().optional(),
  active: z.boolean().default(true)
});

function getId(req: Request): string {
  const id = req.params["id"];
  return Array.isArray(id) ? (id[0] ?? "") : (id ?? "");
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const productCategoryId =
      typeof req.query["productCategoryId"] === "string"
        ? req.query["productCategoryId"]
        : undefined;
    res.json(ok(await listProducts(productCategoryId)));
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(ok(await getProduct(getId(req))));
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const product = await createProduct(productSchema.parse(req.body));
    res.status(201).json(ok(product));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = productSchema.partial().parse(req.body);
    res.json(ok(await updateProduct(getId(req), input)));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await deleteProduct(getId(req));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
