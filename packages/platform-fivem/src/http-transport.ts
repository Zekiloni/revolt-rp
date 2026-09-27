import { HttpTransport } from '@revolt-rp/api-client';

const normalizeHeaders = (headers: unknown): Record<string, string> => {
  const normalized: Record<string, string> = {};

  if (Array.isArray(headers)) {
    for (const entry of headers) {
      if (Array.isArray(entry) && entry.length >= 2) {
        normalized[String(entry[0]).toLowerCase()] = String(entry[1]);
      }
    }
    return normalized;
  }

  if (headers && typeof headers === 'object') {
    for (const [key, value] of Object.entries(headers as Record<string, unknown>)) {
      normalized[key.toLowerCase()] = String(value);
    }
  }

  return normalized;
};

export const createFivemHttpTransport = (): HttpTransport => ({
  request: (options) => {
    return new Promise((resolve, reject) => {
      try {
        PerformHttpRequest(
          options.url,
          (statusCode, body, headers, errorData) => {
            if (statusCode === 0) {
              reject(new Error(errorData || 'HTTP request failed'));
              return;
            }

            resolve({
              status: statusCode,
              body: body ?? '',
              headers: normalizeHeaders(headers)
            });
          },
          options.method,
          options.body ?? '',
          options.headers ?? {}
        );
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }
});
