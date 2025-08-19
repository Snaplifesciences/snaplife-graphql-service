import { authMiddleware, AuthContext } from '../middleware/authMiddleware';

interface ContextParams {
  req: {
    headers: Record<string, string | undefined>;
  };
}

export const buildContext = async ({ req }: ContextParams): Promise<AuthContext> => {
  try {
    return await authMiddleware(req);
  } catch (error) {
    console.error('Authentication failed:', error instanceof Error ? error.message : 'Unknown error');
    return { isAuthenticated: false, error: 'Authentication failed' };
  }
};