import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../shared/models/api-response.model";
import { Product, ProductInput } from "../../shared/models/product.model";
import { fetchApi, fetchEmpty } from "./fetch-api";

export interface ProductDescriptionPrompt {
  name: string;
  sku?: string;
  categoryName: string;
  requiresPrescription: boolean;
}

type ProductDescriptionStreamEvent =
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

@Injectable({
  providedIn: "root"
})
export class ProductService {
  private readonly endpoint = `${environment.apiBaseUrl}/products`;

  list(
    productCategoryId?: string,
    signal?: AbortSignal
  ): Promise<ApiResponse<Product[]>> {
    const url = new URL(this.endpoint, window.location.origin);

    if (productCategoryId) {
      url.searchParams.set("productCategoryId", productCategoryId);
    }

    return fetchApi<Product[]>(url.toString(), { signal });
  }

  create(input: ProductInput): Promise<ApiResponse<Product>> {
    return fetchApi<Product>(this.endpoint, {
      method: "POST",
      body: JSON.stringify(input)
    });
  }

  update(id: string, input: Partial<ProductInput>): Promise<ApiResponse<Product>> {
    return fetchApi<Product>(`${this.endpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  }

  delete(id: string): Promise<void> {
    return fetchEmpty(`${this.endpoint}/${id}`, { method: "DELETE" });
  }

  async *generateDescription(
    input: ProductDescriptionPrompt,
    signal?: AbortSignal
  ): AsyncGenerator<string> {
    const response = await fetch(`${this.endpoint}/generate-description`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input),
      signal
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      throw new Error(
        payload?.error?.message ?? `Description generation failed (${response.status})`
      );
    }

    if (!response.body) {
      throw new Error("The description stream is not available");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const parseLine = (line: string): ProductDescriptionStreamEvent => {
      try {
        return JSON.parse(line) as ProductDescriptionStreamEvent;
      } catch {
        throw new Error("The description stream returned invalid data");
      }
    };

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          buffer += decoder.decode();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line) {
            continue;
          }

          const event = parseLine(line);
          if (event.type === "delta") {
            yield event.text;
          } else if (event.type === "error") {
            throw new Error(event.message);
          }
        }
      }

      if (buffer.trim()) {
        const event = parseLine(buffer);
        if (event.type === "delta") {
          yield event.text;
        } else if (event.type === "error") {
          throw new Error(event.message);
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}
