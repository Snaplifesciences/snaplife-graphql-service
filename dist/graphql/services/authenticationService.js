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
Object.defineProperty(exports, "__esModule", { value: true });
// authenticationService.ts
const apiErrorUtils_1 = require("../../utils/apiErrorUtils");
const authenticationAPI_1 = require("../../datasources/authenticationAPI");
class AuthenticationService {
    signInWithPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('signInWithPassword called with email:', email);
            try {
                return yield authenticationAPI_1.authenticationAPI.signInWithPassword(email, password);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, 'Authentication service failed while signing in');
            }
        });
    }
    invalidateSession(token) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('invalidateSession called with token:', token);
            // Implement logic to invalidate the session
            // Example: Remove token from storage or mark it as invalid
            return true;
        });
    }
    refreshUserToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('refreshUserToken called with refreshToken:', refreshToken);
            // Implement logic to refresh the user token
            // Example: Validate refresh token, generate new token, etc.
            try {
                return yield authenticationAPI_1.authenticationAPI.refreshToken(refreshToken);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, 'Authentication service failed while refreshing token');
            }
        });
    }
}
exports.default = new AuthenticationService();
