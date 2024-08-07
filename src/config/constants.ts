import * as dotenv from 'dotenv';

dotenv.config();

type Config = {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_S3_BUCKET: string;
  AWS_REGION: string;
  DATABASE_URL: string;
  AUTH0_ISSUER_URL: string;
  AUTH0_AUDIENCE: string;
};

export const Config: Config = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
  AWS_REGION: process.env.AWS_REGION,
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH0_ISSUER_URL: process.env.AUTH0_ISSUER_URL,
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
};
