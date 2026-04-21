// Sin VITE_API_URL explícito, usa URL relativa para que el proxy de Vite
// (o Nginx en producción) reenvíe /api/* al backend sin problemas de CORS.
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

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
    let message = response.statusText;
    try {
      const body = await response.json();
      message = body.message || message;
    } catch {
      // keep statusText
    }
    throw new ApiError(response.status, message);
  }

  return response.json();
}

export interface AuthResponse {
  access_token: string;
  user: { id: string; nombre: string; email: string };
}

export const authApi = {
  registro: (data: { nombre: string; email: string; password: string }) =>
    apiFetch<AuthResponse>('/auth/api/auth/registro', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<AuthResponse>('/auth/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: (token: string) =>
    apiFetch('/auth/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
