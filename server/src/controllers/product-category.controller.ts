import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

import {
  createProductCategory,
  deleteProductCategory,
  getProductCategory,
  listProductCategories,
  updateProductCategory
} from "../services/product-category.service.js";
import { ok } from "../utils/api-response.js";

const productCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(500).optional(),
  requiresPrescription: z.boolean().default(false),
  active: z.boolean().default(true)
});

function getId(req: Request): string {
  const id = req.params["id"];
  return Array.isArray(id) ? (id[0] ?? "") : (id ?? "");
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(ok(await listProductCategories()));
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(ok(await getProductCategory(getId(req))));
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = await createProductCategory(productCategorySchema.parse(req.body));
    res.status(201).json(ok(category));
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = productCategorySchema.partial().parse(req.body);
    res.json(ok(await updateProductCategory(getId(req), input)));
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await deleteProductCategory(getId(req));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
