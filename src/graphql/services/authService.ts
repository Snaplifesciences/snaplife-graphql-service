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

  async refreshToken(token: string): Promise<{ tokenId: string; success: boolean }> {
    logger.info('AuthService::refreshToken initiated');
    try {
      const result = await authAPI.refreshToken(token);
      logger.info('AuthService::refreshToken completed successfully');
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('AuthService::refreshToken failed', { error: errorMessage });
      throw wrapServiceError(error, 'Auth service failed while refreshing token');
    }
  }

  async logout(token: string): Promise<{ success: boolean; message: string }> {
    logger.info('AuthService::logout initiated');
    try {
      const result = await authAPI.logout(token);
      logger.info('AuthService::logout completed successfully');
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('AuthService::logout failed', { error: errorMessage });
      throw wrapServiceError(error, 'Auth service failed while logging out');
    }
  }
}

export default new AuthService();