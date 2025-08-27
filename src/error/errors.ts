export interface BackendError {
  status: string;
  message: string;
  debugMessage?: string;
  timestamp?: string;
}

interface BaseErrorParams {
  message: string;
  status?: string;
  httpStatus?: number;
  debugMessage?: string;
  timestamp?: string;
  extensions?: Record<string, unknown>;
}

class BaseError extends Error {
  status?: string;
  httpStatus?: number;
  debugMessage?: string;
  timestamp?: string;
  extensions?: Record<string, unknown>;

  constructor(name: string, params: BaseErrorParams) {
    super(params.message);
    this.name = name;
    this.status = params.status;
    this.httpStatus = params.httpStatus;
    this.debugMessage = params.debugMessage;
    this.timestamp = params.timestamp;
    this.extensions = params.extensions;
  }
}

export class ApiError extends BaseError {
  constructor(params: BaseErrorParams) {
    super("ApiError", params);
  }
}

export class ServiceError extends BaseError {
  code?: string;

  constructor(params: {
    message: string;
    status?: string;
    httpStatus?: number;
    code?: string;
    debugMessage?: string;
    timestamp?: string;
    [key: string]: unknown;
  }) {
    super("ServiceError", params);
    this.code = params.code;
  }
}
