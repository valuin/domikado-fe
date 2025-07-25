const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://be-domikado.vercel.app/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}
