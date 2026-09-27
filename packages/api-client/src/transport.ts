export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface HttpRequestOptions {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface HttpResponse {
  status: number;
  body: string;
  headers?: Record<string, string>;
}

export interface HttpTransport {
  request(options: HttpRequestOptions): Promise<HttpResponse>;
}

export const createFetchTransport = (fetchImpl: typeof fetch = fetch): HttpTransport => ({
  request: async (options) => {
    const response = await fetchImpl(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    return {
      status: response.status,
      body: await response.text(),
      headers
    };
  }
});
