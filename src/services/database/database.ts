import {
  ScanCommandInput,
  BatchWriteCommandInput,
  PutCommandInput,
  GetCommandInput,
  UpdateCommandInput,
  DeleteCommandInput,
  QueryCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { dynamoDBClient, dynamoDBAdapter } from '../../../dynamodb';

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
  const response = await dynamoDBClient.scan(commandInput);

  return (response.Items ?? []) as T;
};

type QueryParams = DatabaseParams & {
  key: Record<string, any>;
};
const query = async <T>({ table, key }: QueryParams): Promise<T> => {
  const expression = dynamoDBAdapter.convertDataToDynamoDBQueryExpression(key);
  const commandInput: QueryCommandInput = {
    TableName: table,
    IndexName: 'user_id_index',
    ...expression,
  };
  const response = await dynamoDBClient.query(commandInput);

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
  await dynamoDBClient.put(commandInput);
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
  await dynamoDBClient.batchWrite(commandInput);
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
      dynamoDBAdapter.convertDataToDynamoDBUpdateExpression(data);
    const commandInput: UpdateCommandInput = {
      TableName: table,
      Key: key,
      ReturnValues: 'ALL_NEW',
      ...expression,
    };
    const response = await dynamoDBClient.update(commandInput);

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
  const response = await dynamoDBClient.get(commandInput);

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
  await dynamoDBClient.delete(commandInput);
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
