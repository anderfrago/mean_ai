import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { createApp } from "./app.js";

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`mean_ai API listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start API", error);
  process.exit(1);
});
