// authService.ts
import { wrapServiceError } from '../../utils/apiErrorUtils';
import { authAPI } from "../../datasources/authAPI";
import { AuthResult } from '../typeDefs/auth';

class AuthService {

  async signInWithPassword(email: string, password: string): Promise<AuthResult>{
    console.log('signInWithPassword called with email:', email);
    try{
        return await authAPI.signInWithPassword(email, password);
    } catch (error) {
        throw wrapServiceError(error, 'Authentication service failed while signing in');
    }
  }

  async invalidateSession(token: string): Promise<boolean> {
    console.log('invalidateSession called with token:', token);
    // Implement logic to invalidate the session
    // Example: Remove token from storage or mark it as invalid
    return true;
  }

  async refreshUserToken(refreshToken: string): Promise<AuthResult> {
    console.log('refreshUserToken called with refreshToken:', refreshToken);
    // Implement logic to refresh the user token
    // Example: Validate refresh token, generate new token, etc.
    try {
      return await authAPI.refreshToken(refreshToken);
    } catch (error) {
      throw wrapServiceError(error, 'Authentication service failed while refreshing token');
    }
  }
}

export default new AuthService();