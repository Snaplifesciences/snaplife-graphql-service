"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyServiceError = exports.CompanyApiError = void 0;
class CompanyApiError extends Error {
    constructor(params) {
        super(params.message);
        this.name = "CompanyApiError";
        this.status = params.status;
        this.httpStatus = params.httpStatus;
        this.debugMessage = params.debugMessage;
        this.timestamp = params.timestamp;
        this.extensions = Object.assign({}, params);
    }
}
exports.CompanyApiError = CompanyApiError;
class CompanyServiceError extends Error {
    constructor(params) {
        super(params.message);
        this.name = "CompanyServiceError";
        this.status = params.status;
        this.httpStatus = params.httpStatus;
        this.debugMessage = params.debugMessage;
        this.timestamp = params.timestamp;
        this.extensions = Object.assign({}, params);
    }
}
exports.CompanyServiceError = CompanyServiceError;
