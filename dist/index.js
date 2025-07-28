"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const schema_1 = require("./graphql/schema");
const resolvers_1 = require("./graphql/resolvers");
const server = new server_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers: resolvers_1.resolvers,
    formatError: (formattedError) => {
        var _a, _b, _c;
        // Log the error to the console for debugging
        console.error('GraphQL Error:', formattedError);
        if (((_a = formattedError.extensions) === null || _a === void 0 ? void 0 : _a.code) === 'INTERNAL_SERVER_ERROR' &&
            ((_b = formattedError.extensions) === null || _b === void 0 ? void 0 : _b.status)) {
            formattedError.extensions.code = formattedError.extensions.status;
        }
        // Remove stacktrace from extensions if present
        if ((_c = formattedError.extensions) === null || _c === void 0 ? void 0 : _c.stacktrace) {
            delete formattedError.extensions.stacktrace;
        }
        return formattedError;
    }
});
(0, standalone_1.startStandaloneServer)(server, {
    listen: { port: 4000 }
}).then(({ url }) => {
    console.log(`🚀 GraphQL server ready at ${url}`);
});
