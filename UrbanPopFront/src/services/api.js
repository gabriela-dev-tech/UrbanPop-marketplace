const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

export async function apiRequest(endpoint, options = {}) {
  const { headers = {}, ...fetchOptions } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...(fetchOptions.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    // The server may return an empty or non-JSON response.
  }

  if (!response.ok) {
    const details = data?.detail ?? data?.items;
    const message = Array.isArray(details)
      ? details.join(" ")
      : typeof details === "string"
        ? details
        : data && typeof data === "object"
          ? Object.values(data)
              .flat()
              .find((value) => typeof value === "string")
          : null;

    throw new Error(message || "The request could not be completed.");
  }

  return data;
}