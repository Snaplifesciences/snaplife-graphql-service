"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustExist = mustExist;
exports.handleResolverError = handleResolverError;
exports.handleAxiosError = handleAxiosError;
exports.wrapServiceError = wrapServiceError;
const axios_1 = __importDefault(require("axios"));
const errors_1 = require("../types/errors");
function mustExist(value, error) {
    if (value === null || value === undefined) {
        throw error;
    }
    return value;
}
function handleResolverError(error, message = 'An unknown error occurred') {
    if (error instanceof Error)
        throw new Error(error.message);
    throw new Error(message);
}
/**
 * Converts an Axios error to a standardized ApiError.
 */
function handleAxiosError(error, defaultMsg) {
    var _a, _b, _c, _d;
    if (axios_1.default.isAxiosError(error)) {
        const httpStatus = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
        const backendErr = typeof ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === 'object'
            ? (_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) !== null && _d !== void 0 ? _d : {}
            : {};
        return new errors_1.ApiError(Object.assign({ status: backendErr.status || 'ERROR', message: backendErr.message || defaultMsg, debugMessage: backendErr.debugMessage, timestamp: backendErr.timestamp, httpStatus }, backendErr));
    }
    return new errors_1.ApiError({
        status: 'ERROR',
        message: defaultMsg,
        debugMessage: error instanceof Error ? error.message : String(error),
    });
}
/**
 * Converts an ApiError to a ServiceError, preserving all details.
 */
function wrapServiceError(error, fallbackMsg) {
    if (error instanceof errors_1.ApiError) {
        const extensions = Object.assign({}, error.extensions);
        // Remove stacktrace if present
        if ('stacktrace' in extensions) {
            delete extensions.stacktrace;
        }
        return new errors_1.ServiceError(Object.assign({ message: `${fallbackMsg}. error: ${error.message}`, status: error.status, httpStatus: error.httpStatus, debugMessage: error.debugMessage, timestamp: error.timestamp }, extensions));
    }
    return error;
}
