import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { resolveEnvPath } from "../src/config/env.js";

describe("environment loading", () => {
  it("finds the root .env when the backend runs from the server workspace", () => {
    const root = mkdtempSync(join(tmpdir(), "mean-ai-env-"));
    const server = join(root, "server");
    mkdirSync(server);
    writeFileSync(join(root, ".env"), "OPENAI_API_KEY=test-root-key\n");

    try {
      expect(resolveEnvPath(server)).toBe(join(root, ".env"));
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
