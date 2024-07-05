type DynamoDBUpdateExpression = {
  UpdateExpression: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, any>;
  ConditionExpression: string;
};
const convertDataToDynamoDBUpdateExpression = (
  data: Record<string, any>,
): DynamoDBUpdateExpression => {
  let expression: DynamoDBUpdateExpression = {
    UpdateExpression: 'set',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
    ConditionExpression: '',
  };

  Object.keys(data).forEach((key, index) => {
    const attributeKey = `#${key}`;
    const attributeValue = `:${key}`;

    const attributeExists = `attribute_exists(${key})`;

    expression = {
      UpdateExpression: `${expression.UpdateExpression}${index === 0 ? '' : ','} ${attributeKey} = ${attributeValue}`,
      ExpressionAttributeNames: {
        ...expression.ExpressionAttributeNames,
        [attributeKey]: key,
      },
      ExpressionAttributeValues: {
        [attributeValue]: data[key],
      },
      ConditionExpression:
        index === 0 ? attributeExists : ` AND ${attributeExists}`,
    };
  });

  return expression;
};

type DynamoDBQueryExpression = {
  KeyConditionExpression: string;
  ExpressionAttributeValues: Record<string, any>;
};
const convertDataToDynamoDBQueryExpression = (
  data: Record<string, any>,
): DynamoDBQueryExpression => {
  let expression: DynamoDBQueryExpression = {
    KeyConditionExpression: '',
    ExpressionAttributeValues: {},
  };

  Object.keys(data).forEach((key, index) => {
    const attributeValue = `:${key}`;
    const keyExpression = `${key} = ${attributeValue}`;

    expression = {
      KeyConditionExpression:
        index === 0 ? keyExpression : ` AND ${keyExpression}`,
      ExpressionAttributeValues: {
        ...expression.ExpressionAttributeValues,
        [attributeValue]: data[key],
      },
    };
  });

  return expression;
};

export const databaseUtils = {
  convertDataToDynamoDBUpdateExpression,
  convertDataToDynamoDBQueryExpression,
};
