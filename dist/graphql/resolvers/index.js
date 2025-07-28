"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const companyResolver_1 = require("./companyResolver");
const organizationResolver_1 = require("./organizationResolver");
const authResolver_1 = require("./authResolver");
const userResolver_1 = require("./userResolver");
const graphql_type_json_1 = require("graphql-type-json");
exports.resolvers = {
    JSONObject: graphql_type_json_1.GraphQLJSONObject,
    Query: Object.assign(Object.assign(Object.assign({}, organizationResolver_1.organizationResolver.Query), companyResolver_1.companyResolver.Query), userResolver_1.userResolver.Query),
    Mutation: Object.assign(Object.assign(Object.assign(Object.assign({}, companyResolver_1.companyResolver.Mutation), organizationResolver_1.organizationResolver.Mutation), userResolver_1.userResolver.Mutation), authResolver_1.authResolver.Mutation),
    Company: Object.assign({}, companyResolver_1.companyResolver.Company),
    Organization: Object.assign({}, organizationResolver_1.organizationResolver.Organization),
};
