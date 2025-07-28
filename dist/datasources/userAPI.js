"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const apiClientFactory_1 = require("../utils/apiClientFactory");
const apiErrorUtils_1 = require("../utils/apiErrorUtils");
//const IAM_BASE_URL = " https://le269y0k40.execute-api.us-east-1.amazonaws.com/dev/api/users";
const IAM_BASE_URL = " http://localhost:8083/api/users";
exports.userAPI = Object.assign(Object.assign({}, (0, apiClientFactory_1.createApiClient)(IAM_BASE_URL)), { getAuthenticatedUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Fetching authenticated user with ID: ${id}`);
            try {
                const response = yield axios_1.default.get(`${IAM_BASE_URL}/authenticated/${id}`);
                const data = response.data;
                console.log(`Authenticated user data:`, data);
                return {
                    id: data.id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    status: data.status,
                    attributes: data.attributes || {},
                    roles: data.roles || [],
                    organizationId: data.organizationId,
                    companyId: data.companyId,
                };
            }
            catch (error) {
                throw (0, apiErrorUtils_1.handleAxiosError)(error, `Authentication failed`);
            }
        });
    },
    activateUser(activationToken, requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${IAM_BASE_URL}/activate/${activationToken}`, requestBody);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to activate user for token ${activationToken}`);
            }
        });
    },
    resendActivationToken(activationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.post(`${IAM_BASE_URL}/resend/${activationToken}`);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to resend activation token for ${activationToken}`);
            }
        });
    },
    validateToken(activationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.get(`${IAM_BASE_URL}?activationToken=${activationToken}`);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to validate activation token ${activationToken}`);
            }
        });
    } });
