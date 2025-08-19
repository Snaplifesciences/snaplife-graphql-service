import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { authMiddleware, AuthContext } from './middleware/authMiddleware';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError) => {
    // Log the error using proper logger
    logger.error('GraphQL Error occurred', formattedError);
    
    // Create new error object without stacktrace
    const { stacktrace, ...extensionsWithoutStacktrace } = formattedError.extensions || {};
    const sanitizedError = {
      ...formattedError,
      extensions: {
        ...extensionsWithoutStacktrace,
        code: formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR' && formattedError.extensions?.status
          ? formattedError.extensions.status
          : formattedError.extensions?.code
      }
    };
    return sanitizedError;
  }
});

const port = parseInt(process.env.PORT || '4000', 10);
if (isNaN(port)) {
  throw new Error('Invalid PORT environment variable');
}

startStandaloneServer(server, {
  listen: { port },
  context: async ({ req }): Promise<AuthContext> => {
    return await authMiddleware(req);
  }
}).then(({ url }) => {
  logger.info('GraphQL server started successfully', { url });
}).catch((error) => {
  logger.error('Failed to start server', error);
  process.exit(1);
});
