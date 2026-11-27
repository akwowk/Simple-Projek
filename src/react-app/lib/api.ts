
interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
}

interface ApiFailure {
  success: false;
  message: string;
  code: string;
  details?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message);

    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(
    options.headers
  );

  if (options.body) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  const response = await fetch(
    `/api${endpoint}`,
    {
      ...options,
      headers,
      credentials: "same-origin",
      cache: "no-store",
    }
  );

  let result:
    | ApiSuccess<T>
    | ApiFailure;

  try {
    result = await response.json();
  } catch {
    throw new ApiError(
      "Response server tidak valid",
      response.status,
      "INVALID_RESPONSE"
    );
  }

  if (!response.ok || !result.success) {
    const code = !result.success
      ? result.code
      : "REQUEST_FAILED";

    if (
      response.status === 401 &&
      endpoint !== "/auth/login"
    ) {
      window.dispatchEvent(
        new Event("auth:unauthorized")
      );
    }

    throw new ApiError(
      result.message || "Request gagal",
      response.status,
      code
    );
  }

  return result.data;
}

export const api = {
  get<T>(endpoint: string) {
    return apiRequest<T>(endpoint);
  },

  post<T>(
    endpoint: string,
    body?: unknown
  ) {
    return apiRequest<T>(
      endpoint,
      {
        method: "POST",
        body:
          body !== undefined
            ? JSON.stringify(body)
            : undefined,
      }
    );
  },

  patch<T>(
    endpoint: string,
    body: unknown
  ) {
    return apiRequest<T>(
      endpoint,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      }
    );
  },

  delete<T>(endpoint: string) {
    return apiRequest<T>(
      endpoint,
      {
        method: "DELETE",
      }
    );
  },
};
