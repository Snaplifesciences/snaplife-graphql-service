import { companyResolver } from './companyResolver';
import { organizationResolver } from './organizationResolver';
import { authResolver } from './authResolver';
import { userResolver } from './userResolver';
import { GraphQLJSONObject } from 'graphql-type-json';
import { contactResolver } from './contactResolver';


export const resolvers = {
  JSONObject: GraphQLJSONObject,
  Query: {
    ...organizationResolver.Query,
    ...companyResolver.Query,
    ...contactResolver.Query,
    ...userResolver.Query,
    ...authResolver.Query,
  },
  Mutation: {
    ...organizationResolver.Mutation,
    ...companyResolver.Mutation,
    ...contactResolver.Mutation,
    ...userResolver.Mutation,
    ...authResolver.Mutation
  },
  Organization: {
    ...organizationResolver.Organization
  },
  Company: {
    ...companyResolver.Company
  }
};
