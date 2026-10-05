export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class ValidationError extends AppError {
  constructor(msg: string, details?: unknown) {
    super(msg, "VALIDATION_ERROR", 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(msg = "Unauthorized") {
    super(msg, "UNAUTHORIZED", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(msg = "Forbidden") {
    super(msg, "FORBIDDEN", 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
  }
}

export class ConflictError extends AppError {
  constructor(msg: string) {
    super(msg, "CONFLICT", 409);
  }
}
