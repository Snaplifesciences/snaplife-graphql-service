import { ApolloServer } from '@apollo/server';
import type { APIGatewayProxyResult } from 'aws-lambda';
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { logger } from './utils/logger';
import authAPI from './datasources/authAPI';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError) => {
    logger.error('GraphQL Error', formattedError);
    
    // Remove stacktrace and create sanitized error
    const { ...extensionsWithoutStacktrace } = formattedError.extensions || {};
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

const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  handlers.createAPIGatewayProxyEventRequestHandler(),
  {
    context: async ({ event }) => {
      logger.info('Creating GraphQL context', {
        hasAuthorization: !!event?.headers?.Authorization || !!event?.headers?.authorization
      });
      
      if (!event || !event.headers) {
        logger.error('No event or headers in context function');
        return {};
      }
      
      const authHeader = event.headers?.Authorization || event.headers?.authorization;
      
      if (!authHeader) {
        logger.info('No authorization header found in context');
        return {};
      }
      
      try {
        const token = authHeader.replace('Bearer ', '');
        const session = await authAPI.getSessionByTokenId(token);
        
        logger.info('User authenticated', { 
          userId: session.user.id,
          email: session.user.email,
          rolesCount: Array.isArray(session.user.roles) ? session.user.roles.length : 0
        });
        
        if (session.expired) {
          logger.error('Session expired');
          return {};
        }
        
        const userContext = {
          user: {
            id: session.user.id,
            email: session.user.email,
            userId: session.user.userId || session.user.id,
            companyId: session.user.companyId || '',
            organizationId: session.user.organizationId || '',
            roles: session.user.roles || []
          }
        };
        
        return userContext;
      } catch (error) {
        logger.error('Authentication failed', { error: error instanceof Error ? error.message : String(error) });
        return {};
      }
    }
  }
);

export const handler = async (event: any, context: any, callback: any): Promise<APIGatewayProxyResult> => {
    logger.info('Lambda handler invoked', {
        httpMethod: event.httpMethod,
        path: event.path,
        hasHeaders: !!event.headers,
        headerKeys: Object.keys(event.headers || {})
    });
    
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        logger.info('Handling OPTIONS request');
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
            },
            body: '',
        };
    }

    // Handle GraphQL requests
    logger.info('Processing GraphQL request');
    const response = (await graphqlHandler(event, context, callback)) as APIGatewayProxyResult;

    return {
        ...response,
        headers: {
            ...(response.headers ?? {}),
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'POST,OPTIONS',
        },
    };
};