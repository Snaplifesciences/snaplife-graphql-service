import { companyResolver } from './company';
import { organizationResolver } from './organization';
import { authenticationResolver } from './authentication';
import { userResolver } from './user';


import { GraphQLJSONObject } from 'graphql-type-json';


export const resolvers = {
  JSONObject: GraphQLJSONObject,
  Query: {
    ...organizationResolver.Query,
    ...companyResolver.Query,
    ...userResolver.Query,
  },
  Mutation: {
    ...companyResolver.Mutation,
    ...organizationResolver.Mutation,
    ...userResolver.Mutation,
    ...authenticationResolver.Mutation
  },
  Company: {
    ...companyResolver.Company
  },
  Organization: {
    ...organizationResolver.Organization
  },
};
