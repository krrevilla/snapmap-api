import { dynamoDBClient } from './dynamodb';
import { mapTableCommand, postsTableCommand } from './tables';

const commands = [mapTableCommand, postsTableCommand];

const run = async () => {
  commands.forEach(async (command) => {
    try {
      const response = await dynamoDBClient.send(command);
      console.log(response.TableDescription);
    } catch (error) {
      console.log(error);
    }
  });
};

run();
