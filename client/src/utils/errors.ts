import axios from 'axios';

// Helpers for working with caught errors, which TypeScript types as `unknown`

// The server's response body for a failed request, if there was one
export const apiErrorData = (error: unknown): unknown =>
  axios.isAxiosError(error) ? error.response?.data : undefined;

export const apiErrorStatus = (error: unknown): number | undefined =>
  axios.isAxiosError(error) ? error.response?.status : undefined;

// The most useful thing to log or show for a failed request: the server's message, else the error's own
export const describeError = (error: unknown): unknown =>
  apiErrorData(error) ?? (error instanceof Error ? error.message : error);

// The message the server sent with a failed request, if any (it uses either `message` or `error`)
export const apiServerMessage = (error: unknown): string | undefined => {
  const data = apiErrorData(error) as { message?: unknown; error?: unknown } | undefined;
  if (typeof data?.message === 'string' && data.message) return data.message;
  if (typeof data?.error === 'string' && data.error) return data.error;
  return undefined;
};

// A message safe to show the customer: the server's own message, else the error's, else a fallback
export const apiErrorMessage = (error: unknown, fallback: string): string =>
  apiServerMessage(error) ?? (error instanceof Error && error.message ? error.message : fallback);
