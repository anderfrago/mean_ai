export interface ApiResponse<TData> {
  data: TData | null;
  meta: Record<string, unknown>;
  error: ApiErrorBody | null;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
