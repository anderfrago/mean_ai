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
        controller.enqueue(encoder.encode('{"type":"delta","text":"First '));
        controller.enqueue(
          encoder.encode('"}\n{"type":"delta","text":"second"}\n{"type":"done"}\n')
        );
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

  it("throws a streamed provider error without a broken HTTP response", async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            '{"type":"error","message":"OpenAI quota exceeded. Check the API plan and billing configuration."}\n'
          )
        );
        controller.close();
      }
    });
    spyOn(globalThis, "fetch").and.resolveTo(
      new Response(body, {
        status: 200,
        headers: { "Content-Type": "application/x-ndjson" }
      })
    );

    const readStream = async () => {
      for await (const _chunk of service.generateDescription({
        name: "Canine vaccine",
        categoryName: "Medication",
        requiresPrescription: true
      })) {
        // The stream should throw its explicit error event.
      }
    };

    await expectAsync(readStream()).toBeRejectedWithError(
      "OpenAI quota exceeded. Check the API plan and billing configuration."
    );
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
