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
exports.authenticationAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const apiErrorUtils_1 = require("../utils/apiErrorUtils");
const BASE_URL = process.env.AUTH_SERVICE_BASE_URL || 'http://localhost:3001/api/auth';
exports.authenticationAPI = {
    signInWithPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.post(`${BASE_URL}/signin`, {
                    email,
                    password,
                });
                console.log('Sign-in response:', res.data);
                // Validate response structure
                if (!res.data || !res.data.token) {
                    throw new Error('Invalid response from authentication service');
                }
                return res.data;
            }
            catch (error) {
                console.error('Error during sign-in:', error);
                throw (0, apiErrorUtils_1.handleAxiosError)(error, `Failed to sign in user with email ${email}`);
            }
        });
    },
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield axios_1.default.post(`${BASE_URL}/refresh`, {
                    refreshToken,
                });
                console.log('Refresh token response:', res.data);
                // Validate response structure
                if (!res.data || !res.data.token) {
                    throw new Error('Invalid response from authentication service');
                }
                return res.data;
            }
            catch (error) {
                throw (0, apiErrorUtils_1.handleAxiosError)(error, 'Failed to refresh user token');
            }
        });
    },
};
