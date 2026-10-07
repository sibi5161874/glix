const API_URL = process.env["NEXT_PUBLIC_API_URL"] ?? "http://localhost:5000";

export interface ApiErrorBody {
  error: string;
  code: string;
  details?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  const { accessToken, headers, ...rest } = options;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      // Only set for a JSON body — Fastify's parser rejects an empty body sent
      // with this header (e.g. a bodyless DELETE), and a `FormData` body (file
      // uploads) needs the browser to set its own multipart boundary instead.
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  const body = await res.json();
  if (!res.ok) {
    const err = body as ApiErrorBody;
    throw new ApiError(err.error ?? "Request failed", err.code ?? "UNKNOWN", err.details);
  }
  return (body as { data: T }).data;
}
