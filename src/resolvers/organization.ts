import organizationService  from '../services/organizationService';

export const organizationResolver = {
  Query: {
    getOrganizationById: async (_parent: any, { id }: { id: string }) => {
      return await organizationService.getById(id);
    },
    getAllOrganizations: async () => {
      return await organizationService.getAll();
    },
    findOrganizationByName: async (_parent: any, { name }: { name: string }) => {
      console.log(`Fetching organization by name: ${name}`);
      return await organizationService.findByName(name);
    }
  },
  Mutation: {
    createOrganization: async (_parent: any, { input }: { input: any }) => {
      return await organizationService.createOrganization(input);
    },
    updateOrganization: async (_parent: any, { id, input }: { id: string, input: any }) => {
      return await organizationService.updateOrganization(id, input);
    },
    deleteOrganization: async (_parent: any, { id }: { id: string }) => {
      return await organizationService.deleteOrganization(id);
    }
  },
  Organization: {
    addresses: (org: any) => org.addresses
  }
};
  