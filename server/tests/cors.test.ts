import request from "supertest";

import { createApp } from "../src/app.js";

describe("CORS", () => {
  it("allows a development localhost origin on a dynamic port", async () => {
    const origin = "http://localhost:39393";
    const response = await request(createApp())
      .options("/api/product-categories")
      .set("Origin", origin)
      .set("Access-Control-Request-Method", "GET")
      .expect(204);

    expect(response.headers["access-control-allow-origin"]).toBe(origin);
  });

  it("does not allow an unrelated origin", async () => {
    const response = await request(createApp())
      .options("/api/product-categories")
      .set("Origin", "https://untrusted.example")
      .set("Access-Control-Request-Method", "GET")
      .expect(200);

    expect(response.headers["access-control-allow-origin"]).toBeUndefined();
  });
});
