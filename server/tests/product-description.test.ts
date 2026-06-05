import { describe, expect, it } from "vitest";

import { env } from "../src/config/env.js";
import { createProductDescriptionStream } from "../src/services/product-description.service.js";

describe("product description generation", () => {
  it("rejects generation when OpenAI is not configured", async () => {

    if (env.OPENAI_API_KEY) {
      return;
    }

    await expect(
      createProductDescriptionStream(
        {
          name: "Canine vaccine",
          categoryName: "Medication",
          requiresPrescription: true
        },
        new AbortController().signal
      )
    ).rejects.toMatchObject({
      status: 503,
      code: "OPENAI_NOT_CONFIGURED"
    });
  });
});
