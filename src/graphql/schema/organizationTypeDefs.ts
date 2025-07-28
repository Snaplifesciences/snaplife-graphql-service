export const organizationTypeDefs = `#graphql
  type Query {
    getOrganizationById(id: ID!): Organization
    getAllOrganizations: [Organization!]!
    findOrganizationByName(name: String!): Organization
  }

  type Mutation {
    createOrganization(input: CreateOrganizationInput!): Organization!
    updateOrganization(id: ID!, input: UpdateOrganizationInput!): Organization!
    deleteOrganization(id: ID!): Boolean!
  }

  input CreateOrganizationInput {
    name: String!
    status: String!
    addresses: [CreateOrganizationAddressInput!]
  }

  input UpdateOrganizationInput {
    name: String
    status: String
    addresses: [CreateOrganizationAddressInput!]
  }

  input CreateOrganizationAddressInput {
    addressLine1: String!
    addressLine2: String
    addressLine3: String
    city: String!
    state: String!
    postalCode: String!
    country: String!
  }

  type Organization {
    id: ID!
    status: String!
    name: String!
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
    country: String!
  }

  type OrganizationSummary {
    id: ID!
    name: String!
  }
`;
