import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { authMiddleware, AuthContext } from './middleware/authMiddleware';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer<AuthContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (formattedError) => {
      // Sanitize error for logging to prevent log injection
      const sanitizedForLog = {
        message: formattedError.message?.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') || 'Unknown error',
        locations: formattedError.locations,
        path: formattedError.path,
        extensions: {
          code: formattedError.extensions?.code?.toString().replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') || 'UNKNOWN'
        }
      };
      logger.error('GraphQL Error', sanitizedForLog);
      
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

  await server.start();

  const port = parseInt(process.env.PORT || '4000', 10);
  if (isNaN(port)) {
    throw new Error('Invalid PORT environment variable');
  }

  // Apply middleware
  app.use(
    '/',
    cors<cors.CorsRequest>({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'tokenId']
    }),
    express.json(),
    expressMiddleware<AuthContext>(server, {
      context: async ({ req }) => {
        try {
          return await authMiddleware(req);
        } catch (error) {
          return { isAuthenticated: false, error: 'Authentication failed' };
        }
      }
    })
  );

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  logger.info('GraphQL server started successfully', { url: `http://localhost:${port}` });
}

startServer().catch((error) => {
  const sanitizedError = {
    message: error?.message?.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') || 'Unknown error',
    name: error?.name?.replace(/[\r\n\t\x00-\x1f\x7f-\x9f]/g, '') || 'Error'
  };
  logger.error('Failed to start server', sanitizedError);
  process.exit(1);
});
