type BaseParams = {
  data: Record<string, any>;
  condition?: Record<string, any>;
};

type ExpressionAttributes = {
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, any>;
};

type ConditionExpressionAttributes = Pick<
  ExpressionAttributes,
  'ExpressionAttributeValues'
> & {
  ConditionExpression: string;
};

type DynamoDBUpdateExpression = ExpressionAttributes & {
  UpdateExpression: string;
  ConditionExpression?: string;
};

const prependForAttributeKeyData = '#';
const prependForAttributeValueData = ':';

const generateExpressionAttributes = (
  data: Record<string, any>,
): ExpressionAttributes => {
  const attributes: ExpressionAttributes = {
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  return Object.keys(data).reduce(
    (currentAttributes, currentKey): ExpressionAttributes => {
      const attributeKey = `${prependForAttributeKeyData}${currentKey}`;
      const attributeValue = `${prependForAttributeValueData}${currentKey}`;

      return {
        ExpressionAttributeNames: {
          ...currentAttributes.ExpressionAttributeNames,
          [attributeKey]: currentKey,
        },
        ExpressionAttributeValues: {
          ...currentAttributes.ExpressionAttributeValues,
          [attributeValue]: data[currentKey],
        },
      };
    },
    attributes,
  );
};

const generateUpdateExpression = (data: Record<string, any>): string => {
  return Object.keys(data).reduce(
    (currentExpression, currentKey, currentIndex) => {
      const attributeKey = `${prependForAttributeKeyData}${currentKey}`;
      const attributeValue = `${prependForAttributeValueData}${currentKey}`;

      const separator = currentIndex === 0 ? 'set ' : `${currentExpression},`;
      return `${separator} ${attributeKey} = ${attributeValue}`;
    },
    '',
  );
};

const generateKeyConditionExpression = (data: Record<string, any>): string => {
  return Object.keys(data).reduce(
    (currentExpression, currentKey, currentIndex) => {
      const attributeValue = `${prependForAttributeValueData}${currentKey}`;
      const keyExpression = `${currentKey} = ${attributeValue}`;

      return currentIndex === 0
        ? keyExpression
        : `${currentExpression} AND ${keyExpression}`;
    },
    '',
  );
};

// Usually used for validation for non-primary keys
const generateConditionExpression = (
  data: Record<string, any>,
): ConditionExpressionAttributes => {
  const attributes: ConditionExpressionAttributes = {
    ConditionExpression: '',
    ExpressionAttributeValues: {},
  };

  return Object.keys(data).reduce(
    (
      currentAttributes,
      currentKey,
      currentIndex,
    ): ConditionExpressionAttributes => {
      const attributeValue = `${prependForAttributeValueData}${currentKey}_Condition`;
      const currentExpression =
        currentIndex === 0
          ? ''
          : `${currentAttributes.ConditionExpression} AND `;

      return {
        ConditionExpression: `${currentExpression}${currentKey} = ${attributeValue}`,
        ExpressionAttributeValues: {
          ...currentAttributes.ExpressionAttributeValues,
          [attributeValue]: data[currentKey],
        },
      };
    },
    attributes,
  );
};

const convertDataToDynamoDBUpdateExpression = ({
  data,
  condition,
}: BaseParams): DynamoDBUpdateExpression => {
  const expressionAttributes = generateExpressionAttributes(data);
  const updateExpression = generateUpdateExpression(data);

  let expression: DynamoDBUpdateExpression = {
    ExpressionAttributeNames: expressionAttributes.ExpressionAttributeNames,
    ExpressionAttributeValues: expressionAttributes.ExpressionAttributeValues,
    UpdateExpression: updateExpression,
  };

  if (condition) {
    const conditionExpression = generateConditionExpression(condition);
    expression = {
      ...expression,
      ConditionExpression: conditionExpression.ConditionExpression,
      ExpressionAttributeValues: {
        ...expression.ExpressionAttributeValues,
        ...conditionExpression.ExpressionAttributeValues,
      },
    };
  }

  return expression;
};

type DynamoDBQueryExpression = {
  KeyConditionExpression: string;
  ExpressionAttributeValues: Record<string, any>;
};
const convertDataToDynamoDBQueryExpression = ({
  data,
}: BaseParams): DynamoDBQueryExpression => {
  const expressionAttributes = generateExpressionAttributes(data);
  const keyConditionExpression = generateKeyConditionExpression(data);

  return {
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributes.ExpressionAttributeValues,
  };
};

type DynamoDBRemoveExpression = {
  ExpressionAttributeValues: Record<string, any>;
  ConditionExpression: string;
};
const convertDataToDynamoDBRemoveExpression = ({
  condition,
}: Pick<BaseParams, 'condition'>): DynamoDBRemoveExpression | undefined => {
  if (condition) {
    return generateConditionExpression(condition);
  }

  return undefined;
};

export const dynamoDBAdapter = {
  convertDataToDynamoDBUpdateExpression,
  convertDataToDynamoDBQueryExpression,
  convertDataToDynamoDBRemoveExpression,
};
