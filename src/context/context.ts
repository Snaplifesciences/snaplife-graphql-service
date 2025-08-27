import { authMiddleware, AuthContext } from '../middleware/authMiddleware';
import { logger } from '../utils/logger';

interface ContextParams {
  req: {
    headers: Record<string, string | undefined>;
  };
}

export const buildContext = async ({ req }: ContextParams): Promise<AuthContext> => {
  try {
    return await authMiddleware(req);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Authentication failed', { error: errorMessage.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') });
    return { isAuthenticated: false, error: 'Authentication failed' };
  }
};