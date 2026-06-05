import type { Request, Response } from "express";

import { fail } from "../utils/api-response.js";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(
    fail({
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.path} was not found`
    })
  );
}
