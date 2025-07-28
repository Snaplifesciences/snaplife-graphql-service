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
exports.companyAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const apiClientFactory_1 = require("../utils/apiClientFactory");
const apiErrorUtils_1 = require("../utils/apiErrorUtils");
//const BASE_URL = 'https://u4xrg11u25.execute-api.us-east-1.amazonaws.com/dev/api/companies';
const BASE_URL = 'http://localhost:8082/api/companies';
exports.companyAPI = Object.assign(Object.assign({}, (0, apiClientFactory_1.createApiClient)(BASE_URL)), { findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`${BASE_URL}/search?name=${encodeURIComponent(name)}`);
                return res.data;
            }
            catch (error) {
                throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to fetch company by name ${name}`);
            }
        });
    },
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`${BASE_URL}/all`);
                return res.data;
            }
            catch (error) {
                throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to fetch all companies`);
            }
        });
    },
    getByOrganizationId(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.get(`${BASE_URL}?organizationId=${encodeURIComponent(organizationId)}`);
                return res.data;
            }
            catch (error) {
                throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to fetch companies by organizationId ${organizationId}`);
            }
        });
    } });
