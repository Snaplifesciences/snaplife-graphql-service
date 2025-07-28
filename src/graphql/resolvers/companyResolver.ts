import  companyService from '../services/companyService';
import  organizationService  from '../services/organizationService';

export const companyResolver = {
  Query: {
    getCompanyById: async (_parent: any, { id }: { id: string }) => {
      return await companyService.getById(id);
    },
    getAllCompanies: async () => {
      return await companyService.getAllCompanies();
    },
    findCompanyByName: async (_parent: any, { name }: { name: string }) => {
      return await companyService.findByName(name);
    },
    getCompaniesByOrganizationId: async (_parent: any, { organizationId }: { organizationId: string }) => {
      return await companyService.getAllByOrganizationId(organizationId);
    }
  },
  Mutation: {
    createCompany: async (_parent: any, { input }: { input: any }) => {
      return await companyService.createCompany(input);
    },
    updateCompany: async (_parent: any, { id, input }: { id: string, input: any }) => {
      return await companyService.updateCompany(id, input);
    },
    deleteCompany: async (_parent: any, { id }: { id: string }) => {
      return await companyService.deleteCompany(id);
    }
  },
  Company: {
    contacts: (company: any) => company.contacts,
    addresses: (company: any) => company.addresses,
    organization: async (company: any) => {
      if (!company.organizationId) return null;
      return await organizationService.getById(company.organizationId);
    }
  }
};
