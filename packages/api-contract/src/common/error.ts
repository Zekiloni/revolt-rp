import { z } from 'zod';

export const apiErrorCodeSchema = z.enum([
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'VALIDATION_FAILED',
  'CONFLICT',
  'INTERNAL'
]);

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

export interface ApiErrorBody {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
}

export const apiError = (code: ApiErrorCode, message: string, details?: unknown): ApiErrorBody => ({
  error: { code, message, details }
});
