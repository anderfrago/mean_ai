import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "../../../environments/environment";
import { ApiResponse } from "../../shared/models/api-response.model";

export interface HealthStatus {
  status: "ok";
  service: string;
}

@Injectable({
  providedIn: "root"
})
export class HealthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getHealth(): Observable<ApiResponse<HealthStatus>> {
    return this.http.get<ApiResponse<HealthStatus>>(`${this.apiBaseUrl}/health`);
  }
}
