export type ErrorStatus =
  | 400
  | 401
  | 403
  | 404
  | 409
  | 422
  | 429
  | 500;

export class ApiError extends Error {
  constructor(
    public status: ErrorStatus,
    message: string,
    public code = "API_ERROR"
  ) {
    super(message);
    this.name = "ApiError";
  }
}