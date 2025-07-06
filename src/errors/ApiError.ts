export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request") {
    super(message, 400);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(message, 403);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(message, 409);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  ConflictError
};