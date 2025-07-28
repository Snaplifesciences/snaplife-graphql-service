import { companyResolver } from './companyResolver';
import { organizationResolver } from './organizationResolver';
import { authResolver } from './authResolver';
import { userResolver } from './userResolver';
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
    ...authResolver.Mutation
  },
  Company: {
    ...companyResolver.Company
  },
  Organization: {
    ...organizationResolver.Organization
  },
};
