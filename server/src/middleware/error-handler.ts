import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { env } from "../config/env.js";
import { fail } from "../utils/api-response.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json(
      fail({
        code: "VALIDATION_ERROR",
        message: "Invalid request",
        details: { issues: err.issues }
      })
    );
    return;
  }

  const message = env.NODE_ENV === "production" ? "Internal server error" : err.message;

  res.status(500).json(
    fail({
      code: "INTERNAL_SERVER_ERROR",
      message
    })
  );
};
