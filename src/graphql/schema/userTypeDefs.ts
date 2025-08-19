export const userTypeDefs = `#graphql

    type Query {
        getUsers: [User!]!
        getAuthenticatedUserById(id: ID!): User
    }

    type Mutation {
        createUser(input: UserInput!): User!
        updateUser(id: ID!, input: UserInput!): User
        deleteUser(id: ID!): Boolean!
        activateUser(activationToken: String!, input: JSONObject!): Boolean!
        resendActivationToken(activationToken: String!): Boolean!
        validateActivationToken(activationToken: String!): Boolean!
    }
  
    type User {
        id: ID!
        email: String!
        firstName: String!
        lastName: String!
        status: String!
        attributes: JSONObject
        roles: [UserRole!]!
        organizationId: ID!
        companyId: ID!
    }

    type UserRole {
        role: String!
        permissions: JSONObject
    }

    input UserInput {
        email: String!
        firstName: String!
        lastName: String!
        status: String
        attributes: JSONObject
        organizationId: ID!
        companyId: ID!
    }
`;