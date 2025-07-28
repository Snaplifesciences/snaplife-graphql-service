"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const company_1 = require("./company");
const organization_1 = require("./organization");
const authentication_1 = require("./authentication");
const user_1 = require("./user");
const graphql_type_json_1 = require("graphql-type-json");
exports.resolvers = {
    JSONObject: graphql_type_json_1.GraphQLJSONObject,
    Query: Object.assign(Object.assign(Object.assign({}, organization_1.organizationResolver.Query), company_1.companyResolver.Query), user_1.userResolver.Query),
    Mutation: Object.assign(Object.assign(Object.assign(Object.assign({}, company_1.companyResolver.Mutation), organization_1.organizationResolver.Mutation), user_1.userResolver.Mutation), authentication_1.authenticationResolver.Mutation),
    Company: Object.assign({}, company_1.companyResolver.Company),
    Organization: Object.assign({}, organization_1.organizationResolver.Organization),
};
