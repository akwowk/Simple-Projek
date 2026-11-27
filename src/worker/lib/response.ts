export function success<T>(
  data: T,
  message = "Berhasil"
) {
  return {
    success: true as const,
    message,
    data,
  };
}

export function failure(
  message: string,
  code = "BAD_REQUEST",
  details?: unknown
) {
  return {
    success: false as const,
    message,
    code,
    ...(details !== undefined
      ? { details }
      : {}),
  };
}