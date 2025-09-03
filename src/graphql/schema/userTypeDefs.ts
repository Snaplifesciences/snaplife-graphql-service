export const userTypeDefs = `#graphql

    extend type Query {
        getUsers: [User!]!
        getAuthenticatedUserById(id: ID!): User
        validateActivationToken(activationToken: String!): StatusResponse!
    }

    extend type Mutation {
        createUser(input: CreateUserInput!): User!
        updateUser(id: ID!, input: UpdateUserInput!): User
        deleteUser(id: ID!): Boolean!
        activateAccount(activationToken: String!, input: ActivateAccountInput!): StatusResponse!
        resendActivationToken(activationToken: String!): StatusResponse!
    }

    type StatusResponse {
        success: Boolean!
        message: String
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

    input ActivateAccountInput {
        password: String!
        confirmPassword: String!
    }

`;