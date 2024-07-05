import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Config } from '../src/config';

export const dynamoDBClient = new DynamoDBClient({
  region: Config.AWS_REGION,
  endpoint: Config.DATABASE_URL,
});
