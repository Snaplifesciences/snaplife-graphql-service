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
const userAPI_1 = require("../../datasources/userAPI");
const apiErrorUtils_1 = require("../../utils/apiErrorUtils");
class UserService {
    fetchUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Fetching all users');
            try {
                return userAPI_1.userAPI.getAll();
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, 'User service failed while getting all the users');
            }
        });
    }
    getAuthenticatedUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Getting authenticated user by id:', id);
            try {
                return yield userAPI_1.userAPI.getAuthenticatedUserById(id);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, 'User service failed while getting authenticated user by id');
            }
        });
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating user:', user);
            try {
                return yield userAPI_1.userAPI.create(user);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, 'User service failed while creating user');
            }
        });
    }
    modifyUser(id, updatedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Updating user with id: ${id}`, updatedUser);
            try {
                return yield userAPI_1.userAPI.update(id, updatedUser);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `User service failed while updating user id: ${id}`);
            }
        });
    }
    removeUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Deleting user with id: ${id}`);
            try {
                return yield userAPI_1.userAPI.delete(id);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `User service failed while deleting user id: ${id}`);
            }
        });
    }
    activateUser(activationToken, input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Activating user with token: ${activationToken}`, input);
            try {
                yield userAPI_1.userAPI.activateUser(activationToken, input);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `User service failed while activating user, token: ${activationToken}`);
            }
            return true;
        });
    }
    resendActivationToken(activationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Resending activation token: ${activationToken}`);
            try {
                yield userAPI_1.userAPI.resendActivationToken(activationToken);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `User service failed while resending activation token, token: ${activationToken}`);
            }
            return true;
        });
    }
    validateToken(activationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Validating activation token: ${activationToken}`);
            yield userAPI_1.userAPI.validateToken(activationToken);
            return true;
        });
    }
}
exports.default = new UserService();
