import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { logger } from '../utils/logger';

const {
  AWS_REGION,
  NODE_ENV
} = process.env;

const REGION = AWS_REGION || "ap-south-1";

// Create DynamoDB client
const client = new DynamoDBClient({ region: REGION });
const documentClient = DynamoDBDocumentClient.from(client);

export const connectDatabase = async (): Promise<void> => {
  try {
    // Test DynamoDB connection by listing tables
    const { DynamoDBClient, ListTablesCommand } = await import("@aws-sdk/client-dynamodb");
    const dynamoClient = new DynamoDBClient({ region: REGION });
    await dynamoClient.send(new ListTablesCommand({}));
    logger.info('DynamoDB connection established successfully');
  } catch (error) {
    logger.error('Unable to connect to DynamoDB:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    // DynamoDB client doesn't need explicit closing
    logger.info('DynamoDB connection closed');
  } catch (error) {
    logger.error('Error closing DynamoDB connection:', error);
    throw error;
  }
};

export { documentClient };
export default documentClient;