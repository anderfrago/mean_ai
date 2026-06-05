import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct
} from "../services/product.service.js";
import { createProductDescriptionStream } from "../services/product-description.service.js";
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

const descriptionGenerationSchema = z.object({
  name: z.string().trim().min(2).max(150),
  sku: z.string().trim().max(50).optional(),
  categoryName: z.string().trim().min(2).max(100),
  requiresPrescription: z.boolean().default(false)
});

function writeStreamEvent(
  res: Response,
  event: { type: "delta"; text: string } | { type: "done" } | { type: "error"; message: string }
): void {
  res.write(`${JSON.stringify(event)}\n`);
}

function getDescriptionStreamErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "insufficient_quota"
  ) {
    return "OpenAI quota exceeded. Check the API plan and billing configuration.";
  }

  return "OpenAI could not generate the product description.";
}

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

export async function generateDescription(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const controller = new AbortController();
  res.on("close", () => controller.abort());

  try {
    const input = descriptionGenerationSchema.parse(req.body);
    const stream = await createProductDescriptionStream(input, controller.signal);

    res.status(200);
    res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        writeStreamEvent(res, { type: "delta", text: event.delta });
      }
    }

    writeStreamEvent(res, { type: "done" });
    res.end();
  } catch (error) {
    if (!res.headersSent) {
      next(error);
      return;
    }

    writeStreamEvent(res, {
      type: "error",
      message: getDescriptionStreamErrorMessage(error)
    });
    res.end();
  }
}
