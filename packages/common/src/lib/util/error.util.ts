export interface ApiError {
  error: true;
  message: string;
}

export const catchError = (error: Error): ApiError => ({
  error: true,
  message: error.message
});
