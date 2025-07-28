import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (formattedError) => {
    // Log the error to the console for debugging
    console.error('GraphQL Error:', formattedError);
    if (formattedError.extensions?.code === 'INTERNAL_SERVER_ERROR' &&
        formattedError.extensions?.status) {
      formattedError.extensions.code = formattedError.extensions.status;
    }
    // Remove stacktrace from extensions if present
    if (formattedError.extensions?.stacktrace) {
      delete formattedError.extensions.stacktrace;
    }
    return formattedError;
  }
});

startStandaloneServer(server, {
  listen: { port: 4000 }
}).then(({ url }) => {
  console.log(`🚀 GraphQL server ready at ${url}`);
});
