export const userTypeDefs = `#graphql

    type Query {
        getUsers: [User!]!
        getAuthenticatedUserById(id: ID!): User
    }

    type Mutation {
        createUser(input: CreateUserInput!): User!
        updateUser(id: ID!, input: UpdateUserInput!): User
        deleteUser(id: ID!): Boolean!
        setupProfile(activationToken: String!, input: SetupProfileInput!): Boolean!
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
        organization: Organization
        company: Company
    }

    type UserRole {
        name: String!
        active: Boolean!
        permissions: JSONObject
    }

    input CreateUserInput {
        email: String!
        firstName: String!
        lastName: String!
        status: String
        roles: [CreateUserRoleInput!]!
        attributes: JSONObject
        organizationId: ID!
        companyId: ID!
    }

    input UpdateUserInput {
        email: String
        firstName: String
        lastName: String
        status: String
        roles: [UpdateUserRoleInput!]!
        attributes: JSONObject
        organizationId: ID!
        companyId: ID!
    }

    input CreateUserRoleInput {
        name: String!
        active: Boolean!
        permissions: JSONObject
    }

    input UpdateUserRoleInput {
        name: String
        active: Boolean
        permissions: JSONObject
    }

    input SetupProfileInput {
        password: String!
        confirmPassword: String!
    }

`;