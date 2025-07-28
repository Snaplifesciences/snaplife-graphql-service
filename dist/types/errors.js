"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(params) {
        super(params.message);
        this.name = "ApiError";
        this.status = params.status;
        this.httpStatus = params.httpStatus;
        this.debugMessage = params.debugMessage;
        this.timestamp = params.timestamp;
        this.extensions = Object.assign({}, params);
    }
}
exports.ApiError = ApiError;
// types/errors.ts
class ServiceError extends Error {
    constructor(params) {
        super(params.message);
        this.name = "ServiceError";
        this.status = params.status;
        this.httpStatus = params.httpStatus;
        this.code = params.code;
        this.debugMessage = params.debugMessage;
        this.timestamp = params.timestamp;
        this.extensions = Object.assign({}, params);
    }
}
exports.ServiceError = ServiceError;
