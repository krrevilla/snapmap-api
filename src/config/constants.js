"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
var dotenv = require("dotenv");
dotenv.config();
exports.Config = {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH0_ISSUER_URL: process.env.AUTH0_ISSUER_URL,
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
};
