import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { logger } from './utils/logger';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError) => {
    logger.error('GraphQL Error', formattedError);
    
    // Remove stacktrace and create sanitized error
    const { stacktrace, ...extensionsWithoutStacktrace } = formattedError.extensions || {};
    const errorCode = (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR' && formattedError.extensions?.status)
      ? formattedError.extensions.status
      : formattedError.extensions?.code;

    return {
      ...formattedError,
      extensions: {
        ...extensionsWithoutStacktrace,
        code: errorCode
      }
    };
  }
});

export const handler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler()
);