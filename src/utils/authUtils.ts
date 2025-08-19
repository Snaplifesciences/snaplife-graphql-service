import { AuthenticationError } from 'apollo-server-errors';
import { AuthContext } from '../middleware/authMiddleware';
import { GraphQLResolveInfo } from 'graphql';

export function requireAuth(context: AuthContext) {
  if (!context.user) {
    throw new AuthenticationError('Authentication required');
  }
  return context.user;
}

type ResolverFunction<TSource = unknown, TArgs = Record<string, unknown>> = (
  parent: TSource,
  args: TArgs,
  context: AuthContext,
  info: GraphQLResolveInfo
) => unknown;

export function withAuth<TSource = unknown, TArgs = Record<string, unknown>>(
  resolver: ResolverFunction<TSource, TArgs>
) {
  return (parent: TSource, args: TArgs, context: AuthContext, info: GraphQLResolveInfo) => {
    requireAuth(context);
    return resolver(parent, args, context, info);
  };
}