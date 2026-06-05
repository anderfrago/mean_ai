import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  MONGODB_URI: z.string().url().or(z.string().startsWith("mongodb://")).default("mongodb://localhost:27017/mean_ai"),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:4200"),
  JWT_SECRET: z.string().min(16).default("replace-me-with-a-long-random-secret"),
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_MODEL: z.string().min(1).default("gpt-5.4-mini")
});

export const env = envSchema.parse(process.env);
