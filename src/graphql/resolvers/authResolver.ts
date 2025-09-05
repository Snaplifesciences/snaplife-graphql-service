import { GraphQLError } from 'graphql';

import authenticationService from '../services/authService';
import userService from '../services/userService';
import companyService from '../services/companyService';
import organizationService from '../services/organizationService';
import { mustExist } from '../../error/apiErrorUtils';
import { logger } from '../../utils/logger';
import { UserRole, SignInResponse, SignInInput } from '../types/auth';

export const authResolver = {
  UserRole: {
    name: (parent: UserRole) => parent.name,
  },

  Query: {},
  
  Mutation: {
    signIn: async (_: any, { input }: { input: SignInInput }): Promise<SignInResponse> => {
      const sanitizedEmail = input.email?.replace(/[\r\n]/g, '') || '';
      logger.debug('AuthResolver::signIn initiated', { email: sanitizedEmail });
      
      const authResponse = await authenticationService.signInWithPassword(input.email, input.password);
      logger.info('AuthResolver::signIn authentication completed');
      
      mustExist(authResponse, new GraphQLError('Invalid credentials', {
        extensions: { code: 'UNAUTHENTICATED' }
      }));
      mustExist(authResponse.tokenId, new GraphQLError('Invalid credentials', {
        extensions: { code: 'UNAUTHENTICATED' }
      }));
      
      const userId = mustExist(authResponse.user.userId, new GraphQLError('Invalid credentials', {
        extensions: { code: 'UNAUTHENTICATED' }
      }));
      
      const user = await userService.getAuthenticatedUserById(userId);
      mustExist(user, new GraphQLError('User not found or not activated', {
        extensions: { code: 'UNAUTHENTICATED' }
      }));
      
      const [company, organization] = await Promise.all([
        companyService.getById(user!.companyId),
        organizationService.getById(user!.organizationId)
      ]);
      
      mustExist(company, new GraphQLError('Company not found', {
        extensions: { code: 'NOT_FOUND' }
      }));
      mustExist(organization, new GraphQLError('Organization not found', {
        extensions: { code: 'NOT_FOUND' }
      }));
      
      logger.info('AuthResolver::signIn completed successfully');
      return {
        tokenId: authResponse.tokenId,
        user,
        company,
        organization,
      };
    },

    refreshToken: async (_: any, __: any, context: any) => {
      // Use tokenId from context (already authenticated)
      const token = context?.tokenId;
      
      logger.info('AuthResolver::refreshToken initiated', { 
        hasToken: !!token,
        tokenLength: token?.length,
        hasUser: !!context?.user
      });
      
      if (!token) {
        throw new GraphQLError('Authorization token required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const result = await authenticationService.refreshToken(token);
      logger.info('AuthResolver::refreshToken completed successfully');
      
      return result;
    },

    logout: async (_: any, __: any, context: any) => {
      const token = context?.tokenId;
      
      logger.info('AuthResolver::logout initiated', { 
        hasToken: !!token,
        tokenLength: token?.length
      });
      
      if (!token) {
        throw new GraphQLError('Authorization token required', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      }

      const result = await authenticationService.logout(token);
      logger.info('AuthResolver::logout completed successfully');
      
      return result;
    },

  },
};