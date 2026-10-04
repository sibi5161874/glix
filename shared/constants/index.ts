/**
 * Constants that don't belong in config (immutable, code-level).
 */

export const HEADER_AUTHORIZATION = "authorization" as const;
export const HEADER_REQUEST_ID = "x-request-id" as const;
export const HEADER_ORG_ID = "x-org-id" as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL: 500,
} as const;
