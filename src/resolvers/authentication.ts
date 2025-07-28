import authenticationService from '../services/authenticationService'; 
import userService from '../services/userService';
import companyService from '../services/companyService';
import organizationService from '../services/organizationService';
import { mustExist } from '../utils/apiErrorUtils';
import { AuthenticationError } from 'apollo-server-errors';

export const authenticationResolver = {

  Query: {
    refreshToken: async (_: any, args: { token: string }) => {
      return authenticationService.refreshUserToken(args.token);
    },
  },

  Mutation: {
    signIn: async (_: any, { input }: any, context: any) => {
      console.log('signIn called with input:', input);
      // 1. Authenticate user with Supabase
      const authResponse = await authenticationService.signInWithPassword(input.email, input.password);

      console.log('Authentication response:', authResponse);
      mustExist(authResponse, new AuthenticationError('Invalid credentials'));
      mustExist(authResponse.token, new AuthenticationError('Invalid credentials'));

      const user = mustExist(
        await userService.getAuthenticatedUserById(authResponse.userId),
        new AuthenticationError('User not found or not activated')
      );

      const company = mustExist(
        await companyService.getById(user.companyId),
        new AuthenticationError('Company not found')
      );

      const organization = mustExist(
        await organizationService.getById(company.organizationId),
        new AuthenticationError('Organization not found')
      );

      // 5. Return required payload (all non-null)
      return {
        token: authResponse.token,
        user,
        company,
        organization,
      };
    },
  },
};