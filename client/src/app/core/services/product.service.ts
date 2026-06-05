import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../shared/models/api-response.model";
import { Product, ProductInput } from "../../shared/models/product.model";
import { fetchApi, fetchEmpty } from "./fetch-api";

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
}
