import { Injectable } from "@angular/core";

import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../shared/models/api-response.model";
import { fetchApi } from "./fetch-api";

export interface HealthStatus {
  status: "ok";
  service: string;
}

@Injectable({
  providedIn: "root"
})
export class HealthService {
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getHealth(signal?: AbortSignal): Promise<ApiResponse<HealthStatus>> {
    return fetchApi<HealthStatus>(`${this.apiBaseUrl}/health`, { signal });
  }
}
