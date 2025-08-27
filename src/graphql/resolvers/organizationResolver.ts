import organizationService from '../services/organizationService';
import { logger } from '../../utils/logger';
import { GraphQLError } from 'graphql';
import { ROLES, PERMISSIONS } from '../../utils/rbacUtils';
import { withRBACAsync, Context } from '../../middleware/withRBAC';
import { CreateOrganizationInput, UpdateOrganizationInput, Organization } from '../types/organization';
import { UserRole } from '../types/auth';

export const organizationResolver = {
  Query: {
    organizations: withRBACAsync([ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN], [PERMISSIONS.MANAGE_ORGANIZATIONS])(async (_: any, __: any, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('OrganizationResolver::organizations — missing user context');
        throw new GraphQLError('Unauthenticated', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );

      if (isPlatformAdmin) {
        logger.info('OrganizationResolver::organizations — fetching all organizations for PLATFORM_ADMIN');
        return organizationService.getOrganizations();
      }

      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.ORGANIZATION_ADMIN
      );

      if (isOrgAdmin) {
        if (!user.organizationId) {
          logger.error('OrganizationResolver::organizations — ORGANIZATION_ADMIN missing organizationId');
          throw new GraphQLError('No organization associated with user', {
            extensions: { code: 'FORBIDDEN' }
          });
        }

        logger.info('OrganizationResolver::organizations — fetching organization by ID', {
          organizationId: user.organizationId
        });

        const organization = await organizationService.getById(user.organizationId);
        if (!organization) {
          logger.error('OrganizationResolver::organizations — organization not found', {
            organizationId: user.organizationId
          });
          throw new GraphQLError(`Organization not found: ${user.organizationId}`, {
            extensions: { code: 'NOT_FOUND' }
          });
        }

        return [organization];
      }

      logger.error('OrganizationResolver::organizations — unauthorized access attempt', {
        userId: user.id,
        roles: user.roles.map(r => r.name).join(', ')
      });
      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),
  },

  Mutation: {
    createOrganization: withRBACAsync([ROLES.PLATFORM_ADMIN], [PERMISSIONS.MANAGE_ORGANIZATIONS])(
      async (_: any, { input }: { input: CreateOrganizationInput }) => {
        return organizationService.createOrganization(input);
      }
    ),

    updateOrganization: withRBACAsync([ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN], [PERMISSIONS.MANAGE_ORGANIZATIONS])(
      async (_: any, { id, input }: { id: string; input: UpdateOrganizationInput }, context: Context) => {
        const { user } = context;
        if (!user) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' }
          });
        }

        const isOrgAdmin = user.roles.some((role: UserRole) => 
          role.active && 
          role.name === ROLES.ORGANIZATION_ADMIN && 
          user.organizationId === id
        );

        if (!isOrgAdmin && !user.roles.some((role: UserRole) => role.active && role.name === ROLES.PLATFORM_ADMIN)) {
          throw new GraphQLError('Unauthorized to update this organization', {
            extensions: { code: 'FORBIDDEN' }
          });
        }

        return organizationService.updateOrganization(id, input);
      }
    ),

    deleteOrganization: withRBACAsync([ROLES.PLATFORM_ADMIN], [PERMISSIONS.MANAGE_ORGANIZATIONS])(
      async (_: any, { id }: { id: string }) => {
        return organizationService.deleteOrganization(id);
      }
    )
  },

  Organization: {
    addresses: (org: Organization) => org.addresses
  }
};
