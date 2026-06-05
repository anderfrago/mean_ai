import type { CorsOptions } from "cors";

import { env } from "./env.js";

const configuredOrigins = new Set(
  env.CLIENT_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

function isLocalDevelopmentOrigin(origin: string): boolean {
  if (env.NODE_ENV === "production") {
    return false;
  }

  try {
    const url = new URL(origin);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      (url.hostname === "localhost" || url.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

export function isCorsOriginAllowed(origin: string): boolean {
  return configuredOrigins.has(origin) || isLocalDevelopmentOrigin(origin);
}

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Requests without Origin are server-to-server, CLI, or same-origin requests.
    callback(null, !origin || isCorsOriginAllowed(origin));
  }
};
