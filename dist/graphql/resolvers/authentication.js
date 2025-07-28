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
exports.authenticationResolver = void 0;
const authenticationService_1 = __importDefault(require("../services/authenticationService"));
const userService_1 = __importDefault(require("../services/userService"));
const companyService_1 = __importDefault(require("../services/companyService"));
const organizationService_1 = __importDefault(require("../services/organizationService"));
const apiErrorUtils_1 = require("../../utils/apiErrorUtils");
const apollo_server_errors_1 = require("apollo-server-errors");
exports.authenticationResolver = {
    Query: {
        refreshToken: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            return authenticationService_1.default.refreshUserToken(args.token);
        }),
    },
    Mutation: {
        signIn: (_1, _a, context_1) => __awaiter(void 0, [_1, _a, context_1], void 0, function* (_, { input }, context) {
            console.log('signIn called with input:', input);
            // 1. Authenticate user with Supabase
            const authResponse = yield authenticationService_1.default.signInWithPassword(input.email, input.password);
            console.log('Authentication response:', authResponse);
            (0, apiErrorUtils_1.mustExist)(authResponse, new apollo_server_errors_1.AuthenticationError('Invalid credentials'));
            (0, apiErrorUtils_1.mustExist)(authResponse.token, new apollo_server_errors_1.AuthenticationError('Invalid credentials'));
            const user = (0, apiErrorUtils_1.mustExist)(yield userService_1.default.getAuthenticatedUserById(authResponse.userId), new apollo_server_errors_1.AuthenticationError('User not found or not activated'));
            const company = (0, apiErrorUtils_1.mustExist)(yield companyService_1.default.getById(user.companyId), new apollo_server_errors_1.AuthenticationError('Company not found'));
            const organization = (0, apiErrorUtils_1.mustExist)(yield organizationService_1.default.getById(company.organizationId), new apollo_server_errors_1.AuthenticationError('Organization not found'));
            // 5. Return required payload (all non-null)
            return {
                token: authResponse.token,
                user,
                company,
                organization,
            };
        }),
    },
};
