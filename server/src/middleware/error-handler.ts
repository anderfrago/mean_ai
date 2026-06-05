import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { env } from "../config/env.js";
import { fail } from "../utils/api-response.js";
import { AppError } from "../utils/app-error.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json(
      fail({
        code: err.code,
        message: err.message,
        details: err.details
      })
    );
    return;
  }

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

  if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
    res.status(409).json(
      fail({
        code: "DUPLICATE_RESOURCE",
        message: "A record with that unique value already exists"
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
