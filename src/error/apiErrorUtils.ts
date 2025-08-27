import axios from 'axios';
import { BackendError, ApiError, ServiceError } from './errors';


export function mustExist<T>(value: T | null | undefined, error: Error): T {
  if (value === null || value === undefined) {
    throw error;
  }
  return value;
}


export function handleResolverError(error: unknown, message = 'An unknown error occurred') {
  if (error instanceof Error) {
    // Preserve original error with additional context
    const enhancedError = new Error(`${message}: ${error.message}`);
    enhancedError.stack = error.stack;
    throw enhancedError;
  }
  throw new Error(`${message}: ${String(error)}`);
}

/**
 * Converts an Axios error to a standardized ApiError.
 */
export function handleAxiosError(error: unknown, defaultMsg: string): ApiError {
  if (axios.isAxiosError(error)) {
    const httpStatus = error.response?.status;
    const responseData = error.response?.data;
    const backendErr: Partial<BackendError> = (typeof responseData === 'object' && responseData !== null)
      ? responseData
      : {};

    return new ApiError({
      status: backendErr.status || 'ERROR',
      message: backendErr.message || defaultMsg,
      debugMessage: backendErr.debugMessage || error.message,
      timestamp: backendErr.timestamp || new Date().toISOString(),
      httpStatus,
    });
  }
  return new ApiError({
    status: 'ERROR',
    message: defaultMsg,
    debugMessage: error instanceof Error ? error.message : String(error),
  });
}

/**
 * Converts an ApiError to a ServiceError, preserving all details.
 */
export function wrapServiceError(error: unknown, fallbackMsg: string): ServiceError {
  if (error instanceof ApiError) {
    const extensions = { ...error.extensions };
    // Remove stacktrace if present
    if ('stacktrace' in extensions) {
      delete extensions.stacktrace;
    }
    return new ServiceError({
      message: `${fallbackMsg}. error: ${error.message}`,
      status: error.status,
      httpStatus: error.httpStatus,
      debugMessage: error.debugMessage,
      timestamp: error.timestamp,
      ...extensions,
    });
  }
  
  // Create a new ServiceError for non-ApiError cases
  return new ServiceError({
    message: fallbackMsg,
    status: 'ERROR',
    debugMessage: error instanceof Error ? error.message : String(error)
  });
}
