import userService from '../services/userService';
import { ROLES, PERMISSIONS } from '../../utils/rbacUtils';
import { withRBACAsync, Context, UserRole } from '../../middleware/withRBAC';
import { CreateUserInput, UpdateUserInput } from '../types/user';
import { GraphQLError } from 'graphql';
import { logger } from '../../utils/logger';

import companyService from '../services/companyService';
import organizationService from '../services/organizationService';

export const userResolver = {
  User: {
    company: async (user: any) => {
      if (!user.companyId) return null;
      try {
        return await companyService.getById(user.companyId);
      } catch (error) {
        logger.error('UserResolver::company - Failed to fetch company', {
          userId: user.id,
          companyId: user.companyId,
          error
        });
        return null;
      }
    },
    organization: async (user: any) => {
      if (!user.organizationId) return null;
      try {
        return await organizationService.getById(user.organizationId);
      } catch (error) {
        logger.error('UserResolver::organization - Failed to fetch organization', {
          userId: user.id,
          organizationId: user.organizationId,
          error
        });
        return null;
      }
    }
  },
  Query: {
    getUsers: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_USERS]
    )(async (_: any, __: any, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('UserResolver::getUsers - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('UserResolver::getUsers - User context', {
        userId: user.id,
        organizationId: user.organizationId,
        companyId: user.companyId,
        roles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.ORGANIZATION_ADMIN
      );
      const isCompanyAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.COMPANY_ADMIN
      );

      if (isPlatformAdmin || isOrgAdmin || isCompanyAdmin) {
        logger.info('UserResolver::getUsers - Access granted', { 
          isPlatformAdmin, isOrgAdmin, isCompanyAdmin
        });
        return userService.fetchUsers();
      }

      logger.error('UserResolver::getUsers - Insufficient permissions', {
        userId: user.id,
        roles: user.roles.map(r => r.name)
      });
      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),

    getAuthenticatedUserById: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_USERS]
    )(async (_: any, { id }: { id: string }, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('UserResolver::getAuthenticatedUserById - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('UserResolver::getAuthenticatedUserById - Request details', {
        requesterId: user.id,
        targetUserId: id,
        requesterRoles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const targetUser = await userService.getAuthenticatedUserById(id);
      
      logger.info('UserResolver::getAuthenticatedUserById - Access check result', {
        targetUserId: id,
        found: !!targetUser
      });

      return targetUser;
    })
  },

  Mutation: {
    createUser: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_USERS]
    )(async (_: any, { input }: { input: CreateUserInput }, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('UserResolver::createUser - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('UserResolver::createUser - Request details', {
        requesterId: user.id,
        targetOrgId: input.organizationId,
        targetCompanyId: input.companyId,
        requesterRoles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.ORGANIZATION_ADMIN && 
        user.organizationId === input.organizationId
      );
      const isCompanyAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.COMPANY_ADMIN && 
        user.companyId === input.companyId
      );

      logger.info('UserResolver::createUser - Access check result', {
        isPlatformAdmin,
        isOrgAdmin,
        isCompanyAdmin,
        userOrgId: user.organizationId,
        userCompanyId: user.companyId,
        targetOrgId: input.organizationId,
        targetCompanyId: input.companyId
      });

      if (isPlatformAdmin || isOrgAdmin || isCompanyAdmin) {
        return userService.createUser(input);
      }

      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),

    updateUser: withRBACAsync(
      [ROLES.PLATFORM_ADMIN, ROLES.ORGANIZATION_ADMIN, ROLES.COMPANY_ADMIN],
      [PERMISSIONS.MANAGE_USERS]
    )(async (_: any, { id, input }: { id: string; input: UpdateUserInput }, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('UserResolver::updateUser - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('UserResolver::updateUser - Request details', {
        requesterId: user.id,
        targetUserId: id,
        requesterRoles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      // Fetch the target user to check organization/company association
      const targetUser = await userService.getAuthenticatedUserById(id);
      if (!targetUser) {
        logger.error('UserResolver::updateUser - Target user not found', { targetUserId: id });
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' }
        });
      }

      const isPlatformAdmin = user.roles.some((role: UserRole) => 
        role.active && role.name === ROLES.PLATFORM_ADMIN
      );
      const isOrgAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.ORGANIZATION_ADMIN && 
        user.organizationId === targetUser.organizationId
      );
      const isCompanyAdmin = user.roles.some((role: UserRole) => 
        role.active && 
        role.name === ROLES.COMPANY_ADMIN && 
        user.companyId === targetUser.companyId
      );

      logger.info('UserResolver::updateUser - Access check result', {
        isPlatformAdmin,
        isOrgAdmin,
        isCompanyAdmin,
        userOrgId: user.organizationId,
        userCompanyId: user.companyId,
        targetOrgId: targetUser.organizationId,
        targetCompanyId: targetUser.companyId
      });

      if (isPlatformAdmin || isOrgAdmin || isCompanyAdmin) {
        return userService.modifyUser(id, input);
      }

      throw new GraphQLError('Insufficient permissions', {
        extensions: { code: 'FORBIDDEN' }
      });
    }),

    deleteUser: withRBACAsync(
      [ROLES.PLATFORM_ADMIN],
      [PERMISSIONS.MANAGE_USERS]
    )(async (_: any, { id }: { id: string }, context: Context) => {
      const { user } = context;
      if (!user) {
        logger.error('UserResolver::deleteUser - Authentication failed: No user context');
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      logger.info('UserResolver::deleteUser - Request details', {
        requesterId: user.id,
        targetUserId: id,
        requesterRoles: user.roles.map(r => ({ name: r.name, active: r.active }))
      });

      // Note: Only Platform Admin can delete users (enforced by RBAC middleware)
      return userService.removeUser(id);
    }),

    // Publicly accessible mutations — no RBAC applied
    setupProfile: (_: any, { activationToken, input }: { activationToken: string; input: any }) =>
      userService.setupProfile(activationToken, input),

    resendActivationToken: (_: any, { activationToken }: { activationToken: string }) =>
      userService.resendActivationToken(activationToken),

    validateActivationToken: (_: any, { activationToken }: { activationToken: string }) =>
      userService.validateToken(activationToken)
  }
};
