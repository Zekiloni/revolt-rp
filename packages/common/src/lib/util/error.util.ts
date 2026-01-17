export interface ApiError {
  error: true;
  message: string;
  status?: number;
  reason?: string;
}

export const catchError = (error: Error): ApiError => ({
  error: true,
  message: error.message,
  reason: error.name,
});
