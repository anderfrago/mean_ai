import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../shared/models/api-response.model";
import {
  ProductCategory,
  ProductCategoryInput
} from "../../shared/models/product-category.model";
import { fetchApi, fetchEmpty } from "./fetch-api";

@Injectable({
  providedIn: "root"
})
export class ProductCategoryService {
  private readonly endpoint = `${environment.apiBaseUrl}/product-categories`;

  list(signal?: AbortSignal): Promise<ApiResponse<ProductCategory[]>> {
    return fetchApi<ProductCategory[]>(this.endpoint, { signal });
  }

  create(input: ProductCategoryInput): Promise<ApiResponse<ProductCategory>> {
    return fetchApi<ProductCategory>(this.endpoint, {
      method: "POST",
      body: JSON.stringify(input)
    });
  }

  update(
    id: string,
    input: Partial<ProductCategoryInput>
  ): Promise<ApiResponse<ProductCategory>> {
    return fetchApi<ProductCategory>(`${this.endpoint}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input)
    });
  }

  delete(id: string): Promise<void> {
    return fetchEmpty(`${this.endpoint}/${id}`, { method: "DELETE" });
  }
}
