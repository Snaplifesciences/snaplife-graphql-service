export const authTypeDefs = `#graphql
  scalar JSONObject

  type Query {
    me: User
    testAuth: String
  }

  type Mutation {
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
