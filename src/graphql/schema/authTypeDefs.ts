export const authTypeDefs = `#graphql
  extend type Query {
    me: User
    testAuth: String
  }

  extend type Mutation {
    signIn(input: SignInInput!): SignInResponse
    refreshToken: RefreshTokenResponse
    logout: LogoutResponse
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

  type RefreshTokenResponse {
    tokenId: String!
    success: Boolean!
  }

  type LogoutResponse {
    success: Boolean!
    message: String!
  }
  
`;
