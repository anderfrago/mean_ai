import { Router } from "express";

import { create, getById, list, remove, update } from "../controllers/product.controller.js";

export const productRouter = Router();

productRouter.get("/", list);
productRouter.post("/", create);
productRouter.get("/:id", getById);
productRouter.patch("/:id", update);
productRouter.delete("/:id", remove);
