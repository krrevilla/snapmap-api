import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Config } from '../../config';

export const tableNames = {
  phMap: 'ph_map',
};

export const databaseClient = (): DocumentClient => {
  return new AWS.DynamoDB.DocumentClient({
    region: Config.AWS_REGION,
    endpoint: Config.DATABASE_URL,
  });
};
