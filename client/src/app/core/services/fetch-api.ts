import { ApiErrorBody, ApiResponse } from "../../shared/models/api-response.model";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly apiError: ApiErrorBody | null
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function fetchApi<TData>(
  url: string,
  init?: RequestInit
): Promise<ApiResponse<TData>> {
  const headers = new Headers(init?.headers);

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<TData> | null;

  if (!response.ok) {
    throw new ApiRequestError(
      payload?.error?.message ?? `Request failed with status ${response.status}`,
      response.status,
      payload?.error ?? null
    );
  }

  if (!payload) {
    throw new ApiRequestError("API returned an empty response", response.status, null);
  }

  return payload;
}

export async function fetchEmpty(url: string, init?: RequestInit): Promise<void> {
  const response = await fetch(url, init);

  if (response.ok) {
    return;
  }

  const payload = (await response.json().catch(() => null)) as ApiResponse<never> | null;
  throw new ApiRequestError(
    payload?.error?.message ?? `Request failed with status ${response.status}`,
    response.status,
    payload?.error ?? null
  );
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiRequestError ? error.message : fallback;
}
