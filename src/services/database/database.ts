import {
  PutCommand,
  ScanCommand,
  ScanCommandInput,
  BatchWriteCommand,
  BatchWriteCommandInput,
  PutCommandInput,
  GetCommandInput,
  GetCommand,
  UpdateCommandInput,
  UpdateCommand,
  DeleteCommand,
  DeleteCommandInput,
  QueryCommandInput,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { dynamoDBClient } from '../../../dynamodb';
import { databaseUtils } from './utils';

export enum Table {
  phMap = 'ph_map',
  posts = 'posts',
}

type DatabaseParams = {
  table: Table;
};

type ScanParams = DatabaseParams;
const scan = async <T>({ table }: ScanParams): Promise<T> => {
  const commandInput: ScanCommandInput = { TableName: table };
  const command = new ScanCommand(commandInput);
  const response = await dynamoDBClient.send(command);

  return (response.Items ?? []) as T;
};

type QueryParams = DatabaseParams & {
  key: Record<string, any>;
};
const query = async <T>({ table, key }: QueryParams): Promise<T> => {
  const expression = databaseUtils.convertDataToDynamoDBQueryExpression(key);
  const commandInput: QueryCommandInput = {
    TableName: table,
    IndexName: 'user_id_index',
    ...expression,
  };
  const command = new QueryCommand(commandInput);
  const response = await dynamoDBClient.send(command);

  return response.Items as T;
};

type PutParams = DatabaseParams & {
  data: Record<string, any>;
};
const put = async ({ table, data }: PutParams): Promise<void> => {
  const commandInput: PutCommandInput = {
    TableName: table,
    Item: data,
  };

  const command = new PutCommand(commandInput);
  await dynamoDBClient.send(command);
};

type PutBatchParams = DatabaseParams & {
  data: any[];
};
const putBatch = async ({ table, data }: PutBatchParams): Promise<void> => {
  const commandInput: BatchWriteCommandInput = {
    RequestItems: {
      [table]: data,
    },
  };
  const command = new BatchWriteCommand(commandInput);
  await dynamoDBClient.send(command);
};

type UpdateParams<K> = DatabaseParams & {
  key: Record<string, any>;
  data: K;
};
const update = async <T, K>({
  table,
  data,
  key,
}: UpdateParams<K>): Promise<T> => {
  try {
    const expression =
      databaseUtils.convertDataToDynamoDBUpdateExpression(data);
    const commandInput: UpdateCommandInput = {
      TableName: table,
      Key: key,
      ReturnValues: 'ALL_NEW',
      ...expression,
    };
    const command = new UpdateCommand(commandInput);
    const response = await dynamoDBClient.send(command);

    return response.Attributes as T;
  } catch (error) {
    console.log(error);
    throw new Error('123');
  }
};

type GetParams = DatabaseParams & {
  key: Record<string, any>;
};
async function get<T>({ table, key }: GetParams): Promise<T | undefined> {
  const commandInput: GetCommandInput = {
    TableName: table,
    Key: key,
  };

  const command = new GetCommand(commandInput);
  const response = await dynamoDBClient.send(command);

  if (!response.Item) {
    return undefined;
  }

  return response.Item as T;
}

type RemoveParams = DatabaseParams & {
  key: Record<string, any>;
};
async function remove({ table, key }: RemoveParams): Promise<void> {
  const commandInput: DeleteCommandInput = {
    TableName: table,
    Key: key,
  };
  const command = new DeleteCommand(commandInput);
  await dynamoDBClient.send(command);
}

export const database = {
  scan,
  query,
  get,
  put,
  putBatch,
  update,
  remove,
};
