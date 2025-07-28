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
const organizationAPI_1 = require("../../datasources/organizationAPI");
const apiErrorUtils_1 = require("../../utils/apiErrorUtils");
class OrganizationService {
    createOrganization(input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Creating organization with input:', input);
            try {
                return yield organizationAPI_1.organizationAPI.create(input);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, 'Organization service failed while creating organization');
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Fetching organization by id: ${id}`);
            try {
                return yield organizationAPI_1.organizationAPI.getById(id);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `Organization service failed while fetching organization by id ${id}`);
            }
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Fetching organization by name: ${name}`);
            try {
                return yield organizationAPI_1.organizationAPI.findByName(name);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `Organization service failed while fetching organization by name ${name}`);
            }
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Fetching all organizations');
            try {
                return yield organizationAPI_1.organizationAPI.getAll();
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, 'Organization service failed while fetching all organizations');
            }
        });
    }
    updateOrganization(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Updating organization with id: ${id}`, input);
            try {
                return yield organizationAPI_1.organizationAPI.update(id, input);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `Organization service failed while updating organization id ${id}`);
            }
        });
    }
    deleteOrganization(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Deleting organization with id: ${id}`);
            try {
                return yield organizationAPI_1.organizationAPI.delete(id);
            }
            catch (error) {
                throw (0, apiErrorUtils_1.wrapServiceError)(error, `Organization service failed while deleting organization id ${id}`);
            }
        });
    }
}
exports.default = new OrganizationService();
