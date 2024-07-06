import { dynamoDBAdapter, dynamoDBClient } from '../../../dynamodb';
import type {
  DatabaseGetParams,
  DatabasePutBatchParams,
  DatabasePutParams,
  DatabaseQueryParams,
  DatabaseRemoveParams,
  DatabaseScanParams,
  DatabaseUpdateParams,
} from './types';

const scan = async <T>(params: DatabaseScanParams): Promise<T> => {
  const response = await dynamoDBClient.scan({ TableName: params.tableName });
  return (response.Items ?? []) as T;
};

const query = async <T>(params: DatabaseQueryParams): Promise<T> => {
  const expression = dynamoDBAdapter.convertDataToDynamoDBQueryExpression({
    data: params.key,
  });
  const response = await dynamoDBClient.query({
    TableName: params.tableName,
    IndexName: params.indexName,
    ...expression,
  });
  return response.Items as T;
};

const put = async (params: DatabasePutParams): Promise<void> => {
  await dynamoDBClient.put({
    TableName: params.tableName,
    Item: params.data,
  });
};

const putBatch = async (params: DatabasePutBatchParams): Promise<void> => {
  await dynamoDBClient.batchWrite({
    RequestItems: {
      [params.tableName]: params.data,
    },
  });
};

const update = async <T>(params: DatabaseUpdateParams): Promise<T> => {
  try {
    const expression = dynamoDBAdapter.convertDataToDynamoDBUpdateExpression({
      data: params.data,
      condition: params.condition,
    });

    const response = await dynamoDBClient.update({
      TableName: params.tableName,
      ReturnValues: 'ALL_NEW',
      Key: params.key,
      ...expression,
    });
    return response.Attributes as T;
  } catch (error) {
    // TODO: Handle Error
    console.log(error);
  }
};

async function get<T>(params: DatabaseGetParams): Promise<T | undefined> {
  const response = await dynamoDBClient.get({
    TableName: params.tableName,
    Key: params.key,
  });

  if (!response.Item) {
    return undefined;
  }

  return response.Item as T;
}

async function remove(params: DatabaseRemoveParams): Promise<void> {
  try {
    const expression = dynamoDBAdapter.convertDataToDynamoDBRemoveExpression({
      condition: params.condition,
    });

    await dynamoDBClient.delete({
      TableName: params.tableName,
      Key: params.key,
      ...expression,
    });
  } catch (error) {
    // TODO: Handle Error
    console.log(error);
  }
}

export enum DatabaseTable {
  phMap = 'ph_map',
  posts = 'posts',
}

export enum DatabasePostsTableIndexKeys {
  userId = 'user_id_index',
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
