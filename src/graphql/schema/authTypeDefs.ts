export const authTypeDefs = `#graphql
  extend type Query {
    me: User
    testAuth: String
  }

  extend type Mutation {
    signIn(input: SignInInput!): SignInResponse
  }

  input SignInInput {
    email: String!
    password: String!
  }

  type SignInResponse {
    tokenId: String!
    user: User!
    company: Company
    organization: Organization
  }
  
`;
