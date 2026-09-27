import { ApiErrorBody, ApiErrorCode } from '@revolt-rp/api-contract';
import { HttpMethod, HttpTransport } from './transport';

export interface ApiClientOptions {
  baseUrl: string;
  token: string;
  transport: HttpTransport;
  retries?: number;
  retryDelayMs?: number;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ApiErrorCode | 'NETWORK',
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

const mutationMethods: ReadonlySet<HttpMethod> = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

const generateIdempotencyKey = () => {
  const cryptoObject = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (cryptoObject?.randomUUID) {
    return cryptoObject.randomUUID();
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const createApiClient = (options: ApiClientOptions) => {
  const { baseUrl, token, transport } = options;
  const retries = options.retries ?? 2;
  const retryDelayMs = options.retryDelayMs ?? 250;

  const request = async <T>(method: HttpMethod, path: string, body?: unknown): Promise<T> => {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    };

    let payload: string | undefined;

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }

    if (mutationMethods.has(method)) {
      headers['Idempotency-Key'] = generateIdempotencyKey();
    }

    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await transport.request({
          method,
          url: `${baseUrl}${path}`,
          headers,
          body: payload
        });

        if (response.status >= 200 && response.status < 300) {
          return (response.body ? JSON.parse(response.body) : undefined) as T;
        }

        if (response.status >= 500 && attempt < retries) {
          await delay(retryDelayMs * (attempt + 1));
          continue;
        }

        let parsed: ApiErrorBody | undefined;
        try {
          parsed = JSON.parse(response.body) as ApiErrorBody;
        } catch {
          parsed = undefined;
        }

        throw new ApiRequestError(
          response.status,
          parsed?.error?.code ?? 'INTERNAL',
          parsed?.error?.message ?? `Request failed with status ${response.status}`,
          parsed?.error?.details
        );
      } catch (error) {
        if (error instanceof ApiRequestError) {
          throw error;
        }

        lastError = error;

        if (attempt < retries) {
          await delay(retryDelayMs * (attempt + 1));
          continue;
        }

        break;
      }
    }

    throw new ApiRequestError(0, 'NETWORK', lastError instanceof Error ? lastError.message : 'Network error');
  };

  return {
    request,
    vehicle: {
      list: (query: Record<string, string | number> = {}) => {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
          params.set(key, String(value));
        }

        const suffix = params.toString() ? `?${params}` : '';
        return request<{ vehicles: unknown[]; total: number }>('GET', `/api/vehicle${suffix}`);
      },
      get: (id: string) => request<{ vehicle: unknown }>('GET', `/api/vehicle/${id}`),
      create: (payload: unknown) => request<{ vehicle: unknown }>('POST', '/api/vehicle', payload),
      update: (id: string, payload: unknown) => request<{ vehicle: unknown }>('PATCH', `/api/vehicle/${id}`, payload),
      remove: (id: string) => request<{ vehicle: unknown }>('DELETE', `/api/vehicle/${id}`)
    }
  };
};

export type ApiClient = ReturnType<typeof createApiClient>;
