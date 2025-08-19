
import { GraphQLFieldResolver } from 'graphql';
import { ForbiddenError, AuthenticationError } from 'apollo-server-errors';

type User = {
  role: string;
  permissions?: Record<string, boolean>;
};

type Context = {
  user?: User;
};

export const withRBACAsync = <TSource = any, TContext = Context, TArgs = any>(
  allowedRoles: string[],
  requiredPermissions: string[] = []
) => {
  return (resolver: GraphQLFieldResolver<TSource, TContext, TArgs>) => {
    return async (parent: TSource, args: TArgs, context: TContext & Context, info: any) => {
      const user = context.user;

      if (!user) {
        throw new AuthenticationError('Authentication required');
      }
      
      if (!allowedRoles.includes(user.role)) {
        throw new ForbiddenError(`Insufficient role permissions. Required: ${allowedRoles.join(', ')}`);
      }

      for (const perm of requiredPermissions) {
        if (!user.permissions?.[perm]) {
          throw new ForbiddenError(`Missing required permission: ${perm}`);
        }
      }

      return await resolver(parent, args, context, info);
    };
  };
};