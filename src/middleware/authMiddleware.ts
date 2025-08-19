import authService from '../graphql/services/authService';
import { logger } from '../utils/logger';

export interface AuthContext {
  user?: {
    id: string;
    email: string;
    companyId?: string | null;
    userId?: string | null;
    [k: string]: unknown;
  };
  tokenId?: string;
  isAuthenticated?: boolean;
  error?: string;
}

interface RequestWithHeaders {
  headers: {
    authorization?: string;
    Authorization?: string;
    tokenid?: string;
    tokenId?: string;
    TokenId?: string;
  };
}

export async function authMiddleware(req: RequestWithHeaders): Promise<AuthContext> {
  logger.info('AuthMiddleware::authMiddleware initiated');
  
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const tokenIdHeader = req.headers.tokenid || req.headers.tokenId || req.headers.TokenId;
  
  const tokenId = authHeader?.replace('Bearer ', '') || tokenIdHeader;
  
  if (!tokenId) {
    logger.info('AuthMiddleware::authMiddleware no token found');
    return {};
  }

  try {
    logger.info('AuthMiddleware::authMiddleware validating session');

    const sessionData = await authService.getSessionByTokenId(tokenId);

    if (!sessionData || sessionData.expired) {
      logger.info('AuthMiddleware::authMiddleware token expired or invalid');
      return {};
    }

    logger.info('AuthMiddleware::authMiddleware completed successfully');
    return {
      user: sessionData.user,
      tokenId
    };
  } catch (error) {
    logger.error('AuthMiddleware::authMiddleware failed', error);
    return {};
  }
  
}