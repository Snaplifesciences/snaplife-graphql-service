export const companyTypeDefs = `#graphql
  type Query {
    companies: [Company!]!
    getCompanyById(id: ID!): Company
  }

  type Mutation {
    createCompany(input: CreateCompanyInput!): Company!
    updateCompany(id: ID!, input: UpdateCompanyInput!): Company!
    deleteCompany(id: ID!): Boolean!
  }

  input CreateCompanyInput {
    organizationId: ID!
    name: String!
    companyType: String!
    financialStatus: String!
    developmentStage: String!
    headquarters: String!
    territory: String!
    partnerStatus: String!
    taxId: String
    attributes: JSONObject
    contacts: [CreateCompanyContactInput!]
    addresses: [CreateCompanyAddressInput!]
  }

  input UpdateCompanyInput {
    organizationId: ID
    name: String
    companyType: String
    financialStatus: String
    developmentStage: String
    headquarters: String
    territory: String
    partnerStatus: String
    taxId: String
    attributes: JSONObject
    contacts: [UpdateCompanyContactInput!]
    addresses: [UpdateCompanyAddressInput!]
  }

  input CreateCompanyContactInput {
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    jobTitle: String!
  }

  input CreateCompanyAddressInput {
    addressLine1: String!
    addressLine2: String
    addressLine3: String
    city: String!
    state: String!
    postalCode: String!
    country: String!
    addressType: String
  }

  input UpdateCompanyContactInput {
    firstName: String
    lastName: String
    email: String
    phone: String
    jobTitle: String
  }

  input UpdateCompanyAddressInput {
    addressLine1: String
    addressLine2: String
    addressLine3: String
    city: String
    state: String
    postalCode: String
    country: String
    addressType: String
  }

  type Company {
    id: ID!
    status: String!
    organizationId: ID!
    name: String!
    companyType: String!
    financialStatus: String!
    developmentStage: String!
    headquarters: String!
    territory: String!
    partnerStatus: String!
    taxId: String
    attributes: JSONObject
    contacts: [CompanyContact!]!
    addresses: [CompanyAddress!]!
    organization: Organization
  }

  type CompanyContact {
    id: ID!
    status: String!
    companyId: ID!
    firstName: String!
    lastName: String!
    email: String!
    phone: String!
    jobTitle: String!
  }

  type CompanyAddress {
    id: ID!
    status: String!
    companyId: ID!
    addressLine1: String!
    addressLine2: String
    addressLine3: String
    city: String!
    state: String!
    postalCode: String!
    country: String!
    addressType: String
  }

`;
