"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const merge_1 = require("@graphql-tools/merge");
const scalars_1 = require("./scalars");
const organizationTypeDefs_1 = require("./organizationTypeDefs");
const companyTypeDefs_1 = require("./companyTypeDefs");
const userTypeDefs_1 = require("./userTypeDefs");
const authTypeDefs_1 = require("./authTypeDefs");
exports.typeDefs = (0, merge_1.mergeTypeDefs)([
    scalars_1.scalarTypeDefs,
    organizationTypeDefs_1.organizationTypeDefs,
    companyTypeDefs_1.companyTypeDefs,
    userTypeDefs_1.userTypeDefs,
    authTypeDefs_1.authTypeDefs,
]);
