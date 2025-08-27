import { mergeTypeDefs } from '@graphql-tools/merge';
import { baseTypeDefs } from './baseTypeDefs';
import { scalarTypeDefs } from './scalars';
import { organizationTypeDefs } from './organizationTypeDefs';
import { companyTypeDefs } from './companyTypeDefs';
import { userTypeDefs } from './userTypeDefs';
import { authTypeDefs } from './authTypeDefs';
import { contactTypeDefs } from './contactTypeDefs';

export const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  scalarTypeDefs,
  organizationTypeDefs,
  companyTypeDefs,
  userTypeDefs,
  authTypeDefs,
  contactTypeDefs,
]);
