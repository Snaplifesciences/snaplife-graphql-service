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
exports.organizationServiceClient = void 0;
const apiClientFactory_1 = require("../utils/apiClientFactory");
const axios_1 = __importDefault(require("axios"));
const apiErrorUtils_1 = require("../utils/apiErrorUtils");
//const BASE_URL = 'https://b1fmewq9hl.execute-api.us-east-1.amazonaws.com/dev/api/organizations';
const BASE_URL = 'http://localhost:8081/api/organizations';
exports.organizationServiceClient = Object.assign(Object.assign({}, (0, apiClientFactory_1.createApiClient)(BASE_URL)), { 
    // Custom method: search by name
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`${BASE_URL}/search?name=${encodeURIComponent(name)}`);
                if (Array.isArray(res.data)) {
                    return res.data.length > 0 ? res.data[0] : null;
                }
                return res.data || null;
            }
            catch (error) {
                throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to fetch organization by name ${name}`);
            }
        });
    } });
