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
const companyClient_1 = require("../clients/companyClient");
const apiErrorUtils_1 = require("../utils/apiErrorUtils");
class CompanyService {
    createCompany(input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating company with input:', input);
            try {
                return yield companyClient_1.companyServiceClient.create(input);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, 'Company service failed while creating company');
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Fetching company by id: ${id}`);
            try {
                return yield companyClient_1.companyServiceClient.getById(id);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `Company service failed while fetching company id ${id}`);
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Fetching company by name: ${name}`);
            try {
                return yield companyClient_1.companyServiceClient.findByName(name);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `Company service failed while fetching company ${name}`);
            }
        });
    }
    getAllByOrganizationId(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Fetching company by organization id: ${organizationId}`);
            try {
                return yield companyClient_1.companyServiceClient.getByOrganizationId(organizationId);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `Company service failed while fetching company by organization id ${organizationId}`);
            }
        });
    }
    getAllCompanies() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Fetching all companies');
            try {
                return yield companyClient_1.companyServiceClient.getAll();
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, 'Company service failed while fetching all companies');
            }
        });
    }
    updateCompany(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Updating company with id: ${id}`, input);
            try {
                return yield companyClient_1.companyServiceClient.update(id, input);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, 'Company service failed while updating company');
            }
        });
    }
    deleteCompany(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Deleting company with id: ${id}`);
            try {
                return yield companyClient_1.companyServiceClient.delete(id);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `Company service failed while deleting company id ${id}`);
            }
        });
    }
}
exports.default = new CompanyService();
