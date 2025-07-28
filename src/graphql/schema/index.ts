import { mergeTypeDefs } from '@graphql-tools/merge';
import { scalarTypeDefs } from './scalars';
import { organizationTypeDefs } from './organizationTypeDefs';
import { companyTypeDefs } from './companyTypeDefs';
import { userTypeDefs } from './userTypeDefs';
import { authTypeDefs } from './authTypeDefs';

export const typeDefs = mergeTypeDefs([
  scalarTypeDefs,
  organizationTypeDefs,
  companyTypeDefs,
  userTypeDefs,
  authTypeDefs,
]);
