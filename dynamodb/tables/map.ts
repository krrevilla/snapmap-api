import {
  CreateTableCommand,
  CreateTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { Table } from '../../src/services';

const mapTableCommandInput: CreateTableCommandInput = {
  TableName: Table.phMap,
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S',
    },
    {
      AttributeName: 'name',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH',
    },
    {
      AttributeName: 'name',
      KeyType: 'RANGE',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

export const mapTableCommand = new CreateTableCommand(mapTableCommandInput);
