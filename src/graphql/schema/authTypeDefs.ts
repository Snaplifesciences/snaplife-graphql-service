export const authTypeDefs = `#graphql
  scalar JSONObject

  type Mutation {
    signIn(input: SignInInput!): SignInPayload
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type SignInPayload {
    token: String
    user: User
    company: CompanySummary
    organization: OrganizationSummary
  }

  type User {
    id: ID
    email: String
    firstName: String
    lastName: String
    status: String
    attributes: JSONObject
    roles: [UserRole!]
    organization: OrganizationSummary
    company: CompanySummary
  }
  
  type UserRole {
    role: String!
    permissions: JSONObject
  }
  
  type OrganizationSummary {
    id: ID!
    name: String!
    status: String!
  }
  
  type CompanySummary {
    id: ID!
    name: String!
    status: String!
  }
  
`;
