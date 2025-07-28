export interface BackendError {
  status: string;
  message: string;
  debugMessage?: string;
  timestamp?: string;
  [key: string]: any; // For future extensibility
}

export class ApiError extends Error {
  status?: string;
  httpStatus?: number;
  debugMessage?: string;
  timestamp?: string;
  extensions?: Record<string, any>;

  constructor(params: BackendError & { httpStatus?: number }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status;
    this.httpStatus = params.httpStatus;
    this.debugMessage = params.debugMessage;
    this.timestamp = params.timestamp;
    this.extensions = { ...params };
  }
}

// types/errors.ts
export class ServiceError extends Error {
  status?: string;
  httpStatus?: number;
  code?: string;
  debugMessage?: string;
  timestamp?: string;
  extensions?: Record<string, any>;

  constructor(params: {
    message: string;
    status?: string;
    httpStatus?: number;
    code?: string;
    debugMessage?: string;
    timestamp?: string;
    [key: string]: any;
  }) {
    super(params.message);
    this.name = "ServiceError";
    this.status = params.status;
    this.httpStatus = params.httpStatus;
    this.code = params.code;
    this.debugMessage = params.debugMessage;
    this.timestamp = params.timestamp;
    this.extensions = { ...params };
  }
}
