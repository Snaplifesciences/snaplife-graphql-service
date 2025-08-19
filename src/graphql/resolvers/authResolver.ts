import authenticationService from '../services/authService'; 
import userService from '../services/userService';
import companyService from '../services/companyService';
import organizationService from '../services/organizationService';
import { mustExist } from '../../utils/apiErrorUtils';
import { AuthenticationError } from 'apollo-server-errors';
import { requireAuth } from '../../utils/authUtils';
import { logger } from '../../utils/logger';

interface SignInInput {
  email: string;
  password: string;
}

interface Context {
  user?: any;
}

export const authResolver = {

  Query: {
    me: async (_: any, __: any, context: Context) => {
      return requireAuth(context);
    },
    testAuth: async (_: any, __: any, context: Context) => {
      logger.info('AuthResolver::testAuth initiated');
      if (context.user) {
        const sanitizedEmail = context.user.email?.replace(/[\r\n]/g, '') || 'unknown';
        return `Authenticated as: ${sanitizedEmail}`;
      }
      return 'Not authenticated - no token provided';
    },
  },
  Mutation: {
    signIn: async (_: any, { input }: { input: SignInInput }, context: Context) => {
      const sanitizedEmail = input.email?.replace(/[\r\n]/g, '') || '';
      logger.debug('AuthResolver::signIn initiated', { email: sanitizedEmail });
      try {
        const authResponse = await authenticationService.signInWithPassword(input.email, input.password);
        logger.info('AuthResolver::signIn authentication completed');
        mustExist(authResponse, new AuthenticationError('Invalid credentials'));
        mustExist(authResponse.tokenId, new AuthenticationError('Invalid credentials'));

        const userId = mustExist(authResponse.user.userId, new AuthenticationError('Invalid credentials'));

        const user = mustExist(
          await userService.getAuthenticatedUserById(userId),
          new AuthenticationError('User not found or not activated')
        );

        const [company, organization] = await Promise.all([
          companyService.getById(user.companyId),
          organizationService.getById(user.organizationId)
        ]);

        mustExist(company, new AuthenticationError('Company not found'));
        mustExist(organization, new AuthenticationError('Organization not found'));

        logger.info('AuthResolver::signIn completed successfully');
        return {
          token: authResponse.tokenId,
          user,
          company,
          organization,
        };
      } catch (error) {
        logger.error('AuthResolver::signIn failed', error);
        throw error;
      }
    },
  },
};