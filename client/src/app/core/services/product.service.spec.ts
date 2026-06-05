import { TestBed } from "@angular/core/testing";

import { ProductService } from "./product.service";

describe("ProductService", () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductService);
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
  });

  it("yields streamed description chunks", async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder.encode("First "));
        controller.enqueue(encoder.encode("second"));
        controller.close();
      }
    });
    spyOn(globalThis, "fetch").and.resolveTo(
      new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/plain" }
      })
    );

    const chunks: string[] = [];
    for await (const chunk of service.generateDescription({
      name: "Canine vaccine",
      categoryName: "Medication",
      requiresPrescription: true
    })) {
      chunks.push(chunk);
    }

    expect(chunks.join("")).toBe("First second");
  });

  it("throws the API error message when generation fails", async () => {
    spyOn(globalThis, "fetch").and.resolveTo(
      new Response(
        JSON.stringify({
          error: {
            message: "OpenAI is not configured on the server"
          }
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" }
        }
      )
    );

    const readStream = async () => {
      for await (const _chunk of service.generateDescription({
        name: "Canine vaccine",
        categoryName: "Medication",
        requiresPrescription: true
      })) {
        // The failed request must throw before yielding content.
      }
    };

    await expectAsync(readStream()).toBeRejectedWithError(
      "OpenAI is not configured on the server"
    );
  });
});
