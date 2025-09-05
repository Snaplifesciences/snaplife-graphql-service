
import { GraphQLFieldResolver } from 'graphql';
import { GraphQLError } from 'graphql';
import { logger } from '../utils/logger';

export type UserRole = {
  active: boolean;
  name: string;
  permissions: Record<string, boolean>;
};

export type User = {
  id: string;
  email: string;
  userId: string;
  companyId: string;
  organizationId: string;
  roles: UserRole[];
};

export type Context = {
  user?: User;
};

export const withRBACAsync = <TSource = any, TContext = Context, TArgs = any>(
  allowedRoles: string[],
  requiredPermissions: string[] = []
) => {
  return (resolver: GraphQLFieldResolver<TSource, TContext, TArgs>) => {
    return async (parent: TSource, args: TArgs, context: TContext & Context, info: any) => {
      logger.info('RBAC middleware executing', { 
        fieldName: info?.fieldName,
        allowedRoles,
        requiredPermissions,
        hasUser: !!context.user,
        contextKeys: Object.keys(context || {})
      });
      
      // Log the entire context for debugging
      logger.debug('Full context object', { context });
      
      const user = context.user;

      if (!user) {
        logger.error('Authentication required - no user in context', {
          contextKeys: Object.keys(context || {}),
          contextType: typeof context,
          hasContext: !!context
        });
        throw new GraphQLError('Authentication required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }
      
      logger.info('User found in context', {
        userId: user.id,
        email: user.email,
        rolesCount: user.roles?.length || 0,
        activeRolesCount: user.roles?.filter(r => r.active).length || 0
      });
      
      if (allowedRoles.length === 0) {
        logger.error('No roles specified for authorization');
        throw new GraphQLError('No roles specified for authorization', {
          extensions: { code: 'FORBIDDEN' }
        });
      }
      
      const activeRoles = user.roles.filter(role => role.active);
      
      // Check for required permissions first
      for (const perm of requiredPermissions) {
        const hasPermission = activeRoles.some(role => 
          role.permissions?.[perm] === true
        );
        if (!hasPermission) {
          logger.error('Missing required permission', {
            requiredPermission: perm,
            userPermissions: activeRoles.map(r => Object.keys(r.permissions)).flat()
          });
          throw new GraphQLError(`Missing required permission: ${perm}`, {
            extensions: { 
              code: 'FORBIDDEN',
              requiredPermission: perm,
              userPermissions: activeRoles.map(r => Object.keys(r.permissions)).flat()
            }
          });
        }
      }

      // If specific roles are required, check those too
      if (allowedRoles.length > 0) {
        const userRoleNames = activeRoles.map(role => role.name);
        const hasRequiredRole = allowedRoles.some(role => userRoleNames.includes(role));
        
        if (!hasRequiredRole) {
          logger.error('Insufficient role permissions', {
            requiredRoles: allowedRoles,
            userRoles: userRoleNames
          });
          throw new GraphQLError(`Insufficient role permissions. Required: ${allowedRoles.join(', ')}`, {
            extensions: { 
              code: 'FORBIDDEN',
              requiredRoles: allowedRoles,
              userRoles: userRoleNames
            }
          });
        }
      }

      logger.info('RBAC authorization successful, executing resolver');
      return await resolver(parent, args, context, info);
    };
  };
};