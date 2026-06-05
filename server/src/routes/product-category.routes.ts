import { Router } from "express";

import {
  create,
  getById,
  list,
  remove,
  update
} from "../controllers/product-category.controller.js";

export const productCategoryRouter = Router();

productCategoryRouter.get("/", list);
productCategoryRouter.post("/", create);
productCategoryRouter.get("/:id", getById);
productCategoryRouter.patch("/:id", update);
productCategoryRouter.delete("/:id", remove);
