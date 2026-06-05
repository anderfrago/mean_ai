import type { Request, Response } from "express";

import { ok } from "../utils/api-response.js";

export function getHealth(_req: Request, res: Response): void {
  res.json(
    ok({
      status: "ok",
      service: "mean_ai"
    })
  );
}
