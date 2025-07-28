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
exports.companyResolver = void 0;
const companyService_1 = __importDefault(require("../services/companyService"));
const organizationService_1 = __importDefault(require("../services/organizationService"));
exports.companyResolver = {
    Query: {
        getCompanyById: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { id }) {
            return yield companyService_1.default.getById(id);
        }),
        getAllCompanies: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield companyService_1.default.getAllCompanies();
        }),
        findCompanyByName: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { name }) {
            return yield companyService_1.default.findByName(name);
        }),
        getCompaniesByOrganizationId: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { organizationId }) {
            return yield companyService_1.default.getAllByOrganizationId(organizationId);
        })
    },
    Mutation: {
        createCompany: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { input }) {
            return yield companyService_1.default.createCompany(input);
        }),
        updateCompany: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { id, input }) {
            return yield companyService_1.default.updateCompany(id, input);
        }),
        deleteCompany: (_parent_1, _a) => __awaiter(void 0, [_parent_1, _a], void 0, function* (_parent, { id }) {
            return yield companyService_1.default.deleteCompany(id);
        })
    },
    Company: {
        contacts: (company) => company.contacts,
        addresses: (company) => company.addresses,
        organization: (company) => __awaiter(void 0, void 0, void 0, function* () {
            if (!company.organizationId)
                return null;
            return yield organizationService_1.default.getById(company.organizationId);
        })
    }
};
