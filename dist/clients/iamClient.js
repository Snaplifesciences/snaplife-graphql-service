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
exports.IamClient = void 0;
const axios_1 = __importDefault(require("axios"));
const apiErrorUtils_1 = require("../utils/apiErrorUtils");
const IAM_BASE_URL = "http://localhost:8083/api/iam";
class IamClient {
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post(`${IAM_BASE_URL}/login`, { email, password });
                const data = response.data;
                // Adapt this mapping to your IAM API response structure!
                return {
                    id: data.id,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    attributes: data.attributes || {},
                    roles: data.roles || [],
                    organization: data.organization,
                    company: data.company,
                };
            }
            catch (error) {
                throw (0, apiErrorUtils_1.handleAxiosError)(error, `Authentication failed`);
            }
        });
    }
}
exports.IamClient = IamClient;
;
