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
exports.organizationResolver = void 0;
const organizationService_1 = require("../services/organizationService");
exports.organizationResolver = {
    Query: {
        getOrganizationById: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { id }) {
            return yield organizationService_1.organizationService.getById(id);
        }),
        getAllOrganizations: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield organizationService_1.organizationService.getAll();
        }),
        findOrganizationByName: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { name }) {
            console.log(`Fetching organization by name: ${name}`);
            return yield organizationService_1.organizationService.findByName(name);
        })
    },
    Mutation: {
        createOrganization: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { input }) {
            return yield organizationService_1.organizationService.createOrganization(input);
        }),
        updateOrganization: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { id, input }) {
            return yield organizationService_1.organizationService.updateOrganization(id, input);
        }),
        deleteOrganization: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { id }) {
            return yield organizationService_1.organizationService.deleteOrganization(id);
        })
    },
    Organization: {
        addresses: (org) => org.addresses
    }
};
