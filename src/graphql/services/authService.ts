import authAPI, { AuthApiSignInResponse, AuthApiSessionResponse } from '../../datasources/authAPI';
import { wrapServiceError } from '../../error/apiErrorUtils';
import { logger } from '../../utils/logger';

class AuthService {

  async signInWithPassword(email: string, password: string): Promise<AuthApiSignInResponse> {
    const sanitizedEmail = email.replace(/[\n\r]/g, '');
    logger.info('AuthService::signInWithPassword initiated', { email: sanitizedEmail });
    try {
      const result = await authAPI.signInWithPassword(email, password);
      logger.info('AuthService::signInWithPassword completed successfully', { userId: result.user.id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('AuthService::signInWithPassword failed', { error: errorMessage });
      throw wrapServiceError(error, 'Auth service failed while signing in');
    }
  }


  async getSessionByTokenId(tokenId: string): Promise<AuthApiSessionResponse> {
    logger.info('AuthService::getSessionByTokenId initiated', { tokenLength: tokenId.length });
    try {
      const result = await authAPI.getSessionByTokenId(tokenId);
      logger.info('AuthService::getSessionByTokenId completed successfully', { userId: result.user.id });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('AuthService::getSessionByTokenId failed', { error: errorMessage });
      throw wrapServiceError(error, 'Auth service failed while verifying session');
    }
  }
}

export default new AuthService();