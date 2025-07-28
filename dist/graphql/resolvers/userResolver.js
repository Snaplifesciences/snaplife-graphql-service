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
exports.userResolver = void 0;
// src/resolvers/user.ts
const userService_1 = __importDefault(require("../services/userService"));
exports.userResolver = {
    Query: {
        getUsers: (_parent, _args, _context) => __awaiter(void 0, void 0, void 0, function* () {
            return yield userService_1.default.fetchUsers();
        }),
        getAuthenticatedUserById: (_parent_1, _a, _context_1) => __awaiter(void 0, [_parent_1, _a, _context_1], void 0, function* (_parent, { id }, _context) {
            return yield userService_1.default.getAuthenticatedUserById(id);
        }),
    },
    Mutation: {
        createUser: (_parent_1, _a, _context_1) => __awaiter(void 0, [_parent_1, _a, _context_1], void 0, function* (_parent, { input }, _context) {
            return yield userService_1.default.createUser(input);
        }),
        updateUser: (_parent_1, _a, _context_1) => __awaiter(void 0, [_parent_1, _a, _context_1], void 0, function* (_parent, { id, input }, _context) {
            return yield userService_1.default.modifyUser(id, input);
        }),
        deleteUser: (_parent_1, _a, _context_1) => __awaiter(void 0, [_parent_1, _a, _context_1], void 0, function* (_parent, { id }, _context) {
            return yield userService_1.default.removeUser(id);
        }),
        activateUser: (_parent_1, _a, _context_1) => __awaiter(void 0, [_parent_1, _a, _context_1], void 0, function* (_parent, { activationToken, input }, _context) {
            return yield userService_1.default.activateUser(activationToken, input);
        }),
        resendActivationToken: (_parent_1, _a, _context_1) => __awaiter(void 0, [_parent_1, _a, _context_1], void 0, function* (_parent, { activationToken }, _context) {
            return yield userService_1.default.resendActivationToken(activationToken);
        }),
        validateActivationToken: (_parent_1, _a, _context_1) => __awaiter(void 0, [_parent_1, _a, _context_1], void 0, function* (_parent, { activationToken }, _context) {
            return yield userService_1.default.validateToken(activationToken);
        }),
    },
};
