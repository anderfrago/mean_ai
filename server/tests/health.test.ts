import request from "supertest";

import { createApp } from "../src/app.js";

describe("GET /api/health", () => {
  it("returns service status", async () => {
    const response = await request(createApp()).get("/api/health").expect(200);

    expect(response.body).toEqual({
      data: {
        status: "ok",
        service: "mean_ai"
      },
      meta: {},
      error: null
    });
  });
});
