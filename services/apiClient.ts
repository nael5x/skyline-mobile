const API_BASE_URL = "https://skylinegroup-sy.com/api";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

function buildUrl(
  path: string,
  params?: Record<string, string | number | undefined | null>
) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (!params) {
    return `${API_BASE_URL}${cleanPath}`;
  }

  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  return query
    ? `${API_BASE_URL}${cleanPath}?${query}`
    : `${API_BASE_URL}${cleanPath}`;
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | undefined | null>
): Promise<T> {
  const url = buildUrl(path, params);

  const response = await fetch(url);
  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    throw new Error(json.message || "API request failed");
  }

  return json.data;
}