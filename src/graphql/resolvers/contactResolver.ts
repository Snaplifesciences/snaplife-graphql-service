import { GraphQLError } from 'graphql';
import { logger } from '../../utils/logger';
import { ROLES, PERMISSIONS } from '../../utils/rbacUtils';
import { withRBACAsync, Context, UserRole } from '../../middleware/withRBAC';
import contactService from '../services/contactService';
import companyService from '../services/companyService';
import { Contact, CreateContactInput, UpdateContactInput } from '../types/contact';

import { Company } from '../types/company';

export const contactResolver = {
    
  Query: {
    contacts: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_CONTACTS]
    )(async (_: any, __: any, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('ContactResolver::contacts - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('ContactResolver::contacts - User context', {
        userId: user.id,
        organizationId: user.organizationId,
        companyId: user.companyId,
        roles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      if (isPlatformAdmin) {
        logger.info('ContactResolver::contacts - Fetching all contacts for platform admin');
        return contactService.getContacts();
      }

      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.ORGANIZATION_ADMIN
      );
      if (isOrgAdmin && user.organizationId) {
        logger.info('ContactResolver::contacts - Fetching contacts for organization', {
          organizationId: user.organizationId
        });
        // Get all companies in the organization
        const orgCompanies = await companyService.getAllByOrganizationId(user.organizationId);
        const orgCompanyIds = orgCompanies.map(c => c.id);
        // Get contacts for all companies in the organization
        const allContacts = await contactService.getContacts();
        return allContacts.filter(contact => orgCompanyIds.includes(contact.companyId));
      }

      const isCompanyAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.COMPANY_ADMIN
      );
      if (isCompanyAdmin && user.companyId) {
        logger.info('ContactResolver::contacts - Fetching contacts for company admin', {
          companyId: user.companyId
        });
        return contactService.getContactsByCompanyId(user.companyId);
      }

      logger.error('ContactResolver::contacts - Insufficient permissions', {
        userId: user.id,
        roles: user.roles.map(r => r.name)
      });
      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),
  },

  Mutation: {
    createContact: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_CONTACTS]
    )(async (_: any, { input }: { input: CreateContactInput }, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('ContactResolver::createContact - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('ContactResolver::createContact - Request details', {
        requesterId: user.id,
        input,
        requesterRoles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.ORGANIZATION_ADMIN 
      );
      const isCompanyAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.COMPANY_ADMIN && 
        user.companyId === input.companyId
      );

      if (isPlatformAdmin || isOrgAdmin || isCompanyAdmin) {
        return contactService.createContact(input);
      }

      logger.error('ContactResolver::createContact - Insufficient permissions', {
        userId: user.id,
        roles: user.roles.map(r => r.name)
      });
      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),

    updateContact: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_CONTACTS]
    )(async (_: any, { id, input }: { id: string; input: UpdateContactInput }, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('ContactResolver::updateContact - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('ContactResolver::updateContact - Request details', {
        requesterId: user.id,
        contactId: id,
        input,
        requesterRoles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const contact = await contactService.getById(id);
      if (!contact) {
        logger.error('ContactResolver::updateContact - Contact not found', { id });
        throw new GraphQLError('Contact not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.ORGANIZATION_ADMIN
      );
      const isCompanyAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.COMPANY_ADMIN && 
        user.companyId === contact.companyId
      );

      if (isPlatformAdmin || isOrgAdmin || isCompanyAdmin) {
        return contactService.updateContact(id, input);
      }

      logger.error('ContactResolver::updateContact - Insufficient permissions', {
        userId: user.id,
        contactId: id,
        roles: user.roles.map(r => r.name)
      });
      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),

    deleteContact: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_CONTACTS]
    )(async (_: any, { id }: { id: string }, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('ContactResolver::deleteContact - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('ContactResolver::deleteContact - Request details', {
        requesterId: user.id,
        contactId: id,
        requesterRoles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const contact = await contactService.getById(id);
      if (!contact) {
        logger.error('ContactResolver::deleteContact - Contact not found', { id });
        throw new GraphQLError('Contact not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.ORGANIZATION_ADMIN
      );
      const isCompanyAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.COMPANY_ADMIN && 
        user.companyId === contact.companyId
      );

      if (isPlatformAdmin || isOrgAdmin || isCompanyAdmin) {
        return contactService.deleteContact(id);
      }

      logger.error('ContactResolver::deleteContact - Insufficient permissions', {
        userId: user.id,
        contactId: id,
        roles: user.roles.map(r => r.name)
      });
      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    })
  },

  Contact: {
    company: async (contact: Contact): Promise<Company | null> => {
      return companyService.getById(contact.companyId);
    }
  }
};
