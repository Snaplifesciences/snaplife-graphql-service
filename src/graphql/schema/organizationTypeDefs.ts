export const organizationTypeDefs = `#graphql
  extend type Query {
    organizations: [Organization!]!
    dashboardStats: DashboardStats!
  }

  type DashboardStats {
    activeOrganizations: Int!
    registeredCompanies: Int!
    invitedUsers: Int!
    activeUsers: Int!
  }

  extend type Mutation {
    createOrganization(input: CreateOrganizationInput!): Organization!
    updateOrganization(id: ID!, input: UpdateOrganizationInput!): Organization!
    deleteOrganization(id: ID!): Boolean!
  }

  input CreateOrganizationInput {
    name: String!
    country: String
    status: String!
    addresses: [CreateOrganizationAddressInput!]
  }

  input UpdateOrganizationInput {
    name: String
    country: String
    status: String
    addresses: [UpdateOrganizationAddressInput!]
  }

  input CreateOrganizationAddressInput {
    addressLine1: String!
    addressLine2: String
    addressLine3: String
    city: String!
    state: String!
    postalCode: String!
    country: String
  }

  input UpdateOrganizationAddressInput {
    id: ID!
    addressLine1: String
    addressLine2: String
    addressLine3: String
    city: String
    state: String
    postalCode: String
    country: String
  }

  type Organization {
    id: ID!
    status: String!
    name: String!
    country: String!
    addresses: [OrganizationAddress!]!
  }

  type OrganizationAddress {
    id: ID!
    status: String!
    organizationId: ID!
    addressLine1: String!
    addressLine2: String
    addressLine3: String
    city: String!
    state: String!
    postalCode: String!
    country: String
  }

`;
