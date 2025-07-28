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
exports.createApiClient = createApiClient;
const axios_1 = __importDefault(require("axios"));
const apiErrorUtils_1 = require("./apiErrorUtils");
function createApiClient(baseUrl) {
    return {
        create(input) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const res = yield axios_1.default.post(baseUrl, input);
                    return res.data;
                }
                catch (error) {
                    throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to create resource`);
                }
            });
        },
        getById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const res = yield axios_1.default.get(`${baseUrl}/${id}`);
                    return res.data;
                }
                catch (error) {
                    throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to fetch resource by id ${id}`);
                }
            });
        },
        getAll() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const res = yield axios_1.default.get(baseUrl);
                    return res.data;
                }
                catch (error) {
                    throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to fetch all resources`);
                }
            });
        },
        update(id, input) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const res = yield axios_1.default.put(`${baseUrl}/${id}`, input);
                    return res.data;
                }
                catch (error) {
                    throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to update resource with id ${id}`);
                }
            });
        },
        delete(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield axios_1.default.delete(`${baseUrl}/${id}`);
                    return true;
                }
                catch (error) {
                    throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to delete resource with id ${id}`);
                }
            });
        },
    };
}
