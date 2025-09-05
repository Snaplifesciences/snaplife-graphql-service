import axios from 'axios';
import https from 'https';
import { handleAxiosError } from '../error/apiErrorUtils';
import { logger } from '../utils/logger';

// Configure axios to ignore SSL certificate errors in development
if (process.env.NODE_ENV === 'dev') {
  axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false
  });
}

// API Response Types
export interface UserRole {
  name: string;
  active: boolean;
  permissions: Record<string, unknown>;
}

export interface AuthApiSignInResponse {
  success: boolean;
  message: string;
  tokenId: string;
  user: {
    id: string;
    email: string;
    companyId?: string | null;
    organizationId?: string | null;
    userId?: string | null;
    roles: UserRole[] | null;
  };
}

export interface AuthApiSessionResponse {
  user: {
    id: string;
    email: string;
    companyId?: string | null;
    userId?: string | null;
    [k: string]: unknown;
  };
  accessToken: string;
  expired: boolean;
}

class  AuthAPI  {
  private BASE_URL: string;
  private API_PATH: string = '/api/auth';

  constructor() {
    if (!process.env.AUTH_SERVICE_BASE_URL) {
      throw new Error('AUTH_SERVICE_BASE_URL environment variable is required');
    }
    this.BASE_URL = process.env.AUTH_SERVICE_BASE_URL;
  }

  /**
   *
   * Signs in a user with email and password.
   * @param email 
   * @param password 
   * @returns 
   */
  async signInWithPassword(email: string, password: string): Promise<AuthApiSignInResponse> {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      const emailDomain = email.split('@')[1] || 'unknown';
      logger.info('AuthAPI::signInWithPassword initiated', { emailDomain: emailDomain.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') });
      const res = await axios.post(`${this.BASE_URL}${this.API_PATH}/signin`, {email,password});
      logger.info('AuthAPI::signInWithPassword successful');
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('AuthAPI::signInWithPassword failed', { error: errorMessage.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') });
      throw handleAxiosError(error, 'Failed to sign in user');
    }
  }
  
  /**
   * Validates the token and returns session details.
   * @param tokenId 
   * @returns 
   */
  async getSessionByTokenId(tokenId: string): Promise<AuthApiSessionResponse> {
    logger.info('AuthAPI::getSessionByTokenId initiated', { tokenIdLength: tokenId.length });
    if (!tokenId || tokenId.trim() === '') {
      throw new Error('Token ID is required');
    }
    try {
      const res = await axios.get(`${this.BASE_URL}${this.API_PATH}/verify?tokenId=${encodeURIComponent(tokenId)}`);
      logger.info('AuthAPI::getSessionByTokenId successful');
      
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('AuthAPI::getSessionByTokenId failed', { error: errorMessage.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') });
      throw handleAxiosError(error, 'Failed to verify session');
    }

  }

  /**
   * Refreshes the access token using Bearer token.
   * @param token 
   * @returns 
   */
  async refreshToken(token: string): Promise<{ tokenId: string; success: boolean }> {
    logger.info('AuthAPI::refreshToken initiated');
    if (!token || token.trim() === '') {
      throw new Error('Token is required');
    }
    try {
      const res = await axios.post(`${this.BASE_URL}${this.API_PATH}/refresh`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      logger.info('AuthAPI::refreshToken successful');
      
      const responseData = res.data;
      return {
        tokenId: responseData.data?.accessToken || responseData.data?.tokenId,
        success: responseData.success || false
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('AuthAPI::refreshToken failed', { error: errorMessage.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') });
      throw handleAxiosError(error, 'Failed to refresh token');
    }

  }

  /**
   * Logs out the user using Bearer token.
   * @param token 
   * @returns 
   */
  async logout(token: string): Promise<{ success: boolean; message: string }> {
    logger.info('AuthAPI::logout initiated');
    if (!token || token.trim() === '') {
      throw new Error('Token is required');
    }
    try {
      const res = await axios.post(`${this.BASE_URL}${this.API_PATH}/logout`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      logger.info('AuthAPI::logout successful');
      
      const responseData = res.data;
      return {
        success: responseData.success || false,
        message: responseData.message || 'Logged out successfully'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('AuthAPI::logout failed', { error: errorMessage.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') });
      throw handleAxiosError(error, 'Failed to logout');
    }
  }


}

export default new AuthAPI();