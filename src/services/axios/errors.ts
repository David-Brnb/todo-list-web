import axios from "axios";

// Friendly, user-facing copy for the HTTP status codes the API can return.
const STATUS_MESSAGES: Record<number, string> = {
  400: "The request was invalid. Please check your input and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That action conflicts with existing data.",
  422: "Some of the information provided is invalid.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "The server ran into a problem. Please try again later.",
  502: "The server is unavailable right now. Please try again later.",
  503: "The service is temporarily unavailable. Please try again later.",
  504: "The server took too long to respond. Please try again later.",
};

// Pulls a message string out of a backend error body when it provides one.
function serverMessage(data: unknown): string | undefined {
  if (typeof data === "string" && data.trim()) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const candidate = obj.message ?? obj.error ?? obj.detail;
    if (typeof candidate === "string" && candidate.trim()) return candidate;
  }
  return undefined;
}

/**
 * Turns any thrown value (axios error, Error, unknown) into a single, concise,
 * user-facing string. Distinguishes timeouts and offline/network failures from
 * HTTP status errors, and surfaces the backend's own message for 400/422.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Check your connection and try again.";
    }
    if (!error.response) {
      return "Couldn't reach the server. Check your connection and try again.";
    }

    const status = error.response.status;
    const fromServer = serverMessage(error.response.data);

    // For validation errors the backend's message is the most useful thing to show.
    if (status === 400 || status === 422) {
      return fromServer ?? STATUS_MESSAGES[status] ?? fallback;
    }
    return STATUS_MESSAGES[status] ?? fromServer ?? fallback;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
