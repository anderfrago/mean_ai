import dotenv from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

export function resolveEnvPath(cwd = process.cwd()): string | undefined {
  const envPathCandidates = [
    resolve(cwd, ".env"),
    resolve(cwd, "../.env"),
    resolve(cwd, "../../.env")
  ];

  return envPathCandidates.find((candidate) => existsSync(candidate));
}

const envPath = resolveEnvPath();

if (envPath) {
  dotenv.config({ path: envPath });
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().url().or(z.string().startsWith("mongodb://")).default("mongodb://localhost:27017/mean_ai"),
  CLIENT_ORIGIN: z.string().min(1).default("http://localhost:4200"),
  JWT_SECRET: z.string().min(16).default("replace-me-with-a-long-random-secret"),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().min(1).default("gpt-5.4-mini")
});

export const env = envSchema.parse(process.env);
