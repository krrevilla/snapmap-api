import {
  CreateTableCommand,
  CreateTableCommandInput,
} from '@aws-sdk/client-dynamodb';
import { Table } from '../../src/services';

const postsTableCommandInput: CreateTableCommandInput = {
  TableName: Table.posts,
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH',
    },
  ],
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S',
    },
    {
      AttributeName: 'user_id',
      AttributeType: 'S',
    },
    {
      AttributeName: 'map_id',
      AttributeType: 'S',
    },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'user_id_index',
      KeySchema: [
        {
          AttributeName: 'user_id',
          KeyType: 'HASH',
        },
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
    {
      IndexName: 'map_id_index',
      KeySchema: [
        {
          AttributeName: 'map_id',
          KeyType: 'HASH',
        },
      ],
      Projection: {
        ProjectionType: 'ALL',
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
      },
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5,
  },
};

export const postsTableCommand = new CreateTableCommand(postsTableCommandInput);
