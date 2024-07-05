import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Config } from '../src/config';

const client = new DynamoDB({
  region: Config.AWS_REGION,
  endpoint: Config.DATABASE_URL,
});

export const dynamoDBClient = DynamoDBDocument.from(client);
