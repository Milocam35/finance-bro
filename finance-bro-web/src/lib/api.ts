// En desarrollo sin VITE_API_URL explícito, usa el mismo hostname del frontend
// para que funcione tanto desde localhost como desde otros dispositivos en la red local.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  `http://${window.location.hostname}:3000`;

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
