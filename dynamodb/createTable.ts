import { dynamoDBClient } from './dynamodb';
import { postsTableCommand } from './tables';

const commands = [postsTableCommand];

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
