import organizationService  from '../services/organizationService';
import { withAuth } from '../../utils/authUtils';
import { withRBACAsync } from '../../middleware/withRBAC';
import { logger } from '../../utils/logger';

export const organizationResolver = {
  Query: {
    getOrganizationById: withRBACAsync(['PLATFORM_ADMIN','ORG_ADMIN'], ['manageOrganization', 'manageCompanies'])(async (_parent: any, { id }: { id: string }) => {
      return await organizationService.getById(id);
    }),
    getOrganizations: withRBACAsync(['PLATFORM_ADMIN'], ['manageCompanies','manageOrganization'])(async (_, args, context) => {
      return await organizationService.getAll();
    }),
    findOrganizationByName: withRBACAsync(['PLATFORM_ADMIN','ORG_ADMIN'], ['manageOrganization', 'manageCompanies'])(async (_parent: any, { name }: { name: string }) => {
      const sanitizedName = name.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '');
      logger.info('OrganizationResolver::findOrganizationByName initiated', { name: sanitizedName });
      return await organizationService.findByName(name);
    })
  },
  Mutation: {
    createOrganization: withRBACAsync(['PLATFORM_ADMIN'], ['manageCompanies','manageOrganization'])(async (_parent: any, { input }: { input: any }) => {
      return await organizationService.createOrganization(input);
    }),
    updateOrganization: withRBACAsync(['PLATFORM_ADMIN'], ['manageCompanies','manageOrganization'])(async (_parent: any, { id, input }: { id: string, input: any }) => {
      return await organizationService.updateOrganization(id, input);
    }),
    deleteOrganization: withRBACAsync(['PLATFORM_ADMIN'], ['manageCompanies','manageOrganization'])(async (_parent: any, { id }: { id: string }) => {
      return await organizationService.deleteOrganization(id);
    })
  },
  Organization: {
    addresses: (org: any) => org.addresses
  }
};
  