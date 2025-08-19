import axios from 'axios';
import { handleAxiosError } from '../utils/apiErrorUtils';
import { SignInResponse, SessionResponse } from '../graphql/typeDefs/auth';
import { logger } from '../utils/logger';

if (!process.env.AUTH_SERVICE_BASE_URL) {
  throw new Error('AUTH_SERVICE_BASE_URL environment variable is required');
}
const BASE_URL = process.env.AUTH_SERVICE_BASE_URL;


class  AuthAPI  {

  /**
   * 
   * Signs in a user with email and password.
   * @param email 
   * @param password 
   * @returns 
   */
  async signInWithPassword(email: string, password: string): Promise<SignInResponse> {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      logger.info('Signing in user');
      const res = await axios.post(`${BASE_URL}/signin`, {email,password});
      logger.info('Sign-in successful');
      const responseData = res.data;
      const signinData = responseData.data;
      
      if (!signinData?.tokenId || !signinData?.user?.id) {
        throw new Error('Invalid response from authentication service');
      }
      
      return {
        message: responseData.message,
        success: responseData.success || false,
        tokenId: signinData.tokenId,
        user: signinData.user
      };
    } catch (error) {
      logger.error('Error during sign-in', error);
      throw handleAxiosError(error, 'Failed to sign in user');
    }
  }
  
  /**
   * Validates the token and returns session details.
   * @param tokenId 
   * @returns 
   */
  async getSessionByTokenId(tokenId: string): Promise<SessionResponse> {
    logger.info('Getting session by tokenId');
    try {
      const res = await axios.get(`${BASE_URL}/verify?tokenId=${encodeURIComponent(tokenId)}`);
      logger.info('Session verification successful');
      
      const responseData = res.data;
      const sessionData = responseData.data;
      
      if (!sessionData?.user?.id) {
        throw new Error('Invalid session response from authentication service');
      }
      
      return {
        user: sessionData.user,
        expired: sessionData.expired || false,
        accessToken: sessionData.accessToken || tokenId
      };
    } catch (error) {
      logger.error('Error verifying session', error);
      throw handleAxiosError(error, 'Failed to verify session');
    }
  }
}

export default new AuthAPI();
