// authService.ts
import { wrapServiceError } from '../../utils/apiErrorUtils';
import { SignInResponse, SessionResponse } from '../typeDefs/auth';
import authAPI from '../../datasources/authAPI';

import { logger } from '../../utils/logger';

class AuthService {

  async signInWithPassword(email: string, password: string): Promise<SignInResponse>{
    const sanitizedEmail = email.replace(/[\r\n]/g, '');
    logger.info('AuthService::signInWithPassword initiated', { email: sanitizedEmail });
    try{
        const result = await authAPI.signInWithPassword(email, password);
        logger.info('AuthService::signInWithPassword completed successfully');
        return result;
    } catch (error) {
        logger.error('AuthService::signInWithPassword failed', error);
        throw wrapServiceError(error, 'AuthService::Authentication service failed while signing in');
    }
  }

  async invalidateSession(token: string): Promise<boolean> {
    logger.info('AuthService::invalidateSession initiated', { tokenLength: token.length });
    try {
      // Implement logic to invalidate the session
      // Example: Remove token from storage or mark it as invalid
      logger.info('AuthService::invalidateSession completed successfully');
      return true;
    } catch (error) {
      logger.error('AuthService::invalidateSession failed', error);
      throw error;
    }
  }

  async getSessionByTokenId(tokenId: string): Promise<SessionResponse> {
    logger.info('AuthService::getSessionByTokenId initiated', { tokenLength: tokenId.length });
    try {
      const result = await authAPI.getSessionByTokenId(tokenId);
      logger.info('AuthService::getSessionByTokenId completed successfully');
      return result;
    } catch (error) {
      logger.error('AuthService::getSessionByTokenId failed', error);
      throw wrapServiceError(error, 'AuthService::Authentication service failed while verifying session');
    }
  }


}

export default new AuthService();