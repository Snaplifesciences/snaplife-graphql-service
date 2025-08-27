import authService from '../graphql/services/authService';
import { logger } from '../utils/logger';
import { Request } from 'express';

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

type RequestWithHeaders = {
  headers: {
    authorization?: string;
    Authorization?: string;
    tokenid?: string;
    tokenId?: string;
    TokenId?: string;
  };
}

export async function authMiddleware(req: RequestWithHeaders): Promise<AuthContext> {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const tokenIdHeader = req.headers.tokenid || req.headers.tokenId || req.headers.TokenId;
  
  const tokenId = authHeader?.replace('Bearer ', '') || tokenIdHeader;
  
  if (!tokenId) {
    return {};
  }

  try {
    const sessionData = await authService.getSessionByTokenId(tokenId);

    if (!sessionData || sessionData.expired) {
      return {};
    }
    
    return {
      user: sessionData.user,
      tokenId
    };
  } catch (error) {
    return {};
  }
  
}