import type { ApiErrorBody, ApiResponse } from "../types/api-response.js";

export function ok<TData>(data: TData, meta: Record<string, unknown> = {}): ApiResponse<TData> {
  return {
    data,
    meta,
    error: null
  };
}

export function fail(error: ApiErrorBody, meta: Record<string, unknown> = {}): ApiResponse<never> {
  return {
    data: null,
    meta,
    error
  };
}
