import { documentClient } from '../config/database';
import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  ScanCommand, 
  QueryCommand,
  BatchGetCommand,
  BatchWriteCommand
} from '@aws-sdk/lib-dynamodb';
import { logger } from '../utils/logger';

export class DynamoDBService {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  // Create or update an item
  async put(item: Record<string, any>): Promise<any> {
    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: item
      });
      const result = await documentClient.send(command);
      logger.debug(`Item created/updated in ${this.tableName}:`, item);
      return result;
    } catch (error) {
      logger.error(`Error putting item in ${this.tableName}:`, error);
      throw error;
    }
  }

  // Get a single item by key
  async get(key: Record<string, any>): Promise<any> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: key
      });
      const result = await documentClient.send(command);
      return result.Item;
    } catch (error) {
      logger.error(`Error getting item from ${this.tableName}:`, error);
      throw error;
    }
  }

  // Update an item
  async update(key: Record<string, any>, updateExpression: string, expressionAttributeValues: Record<string, any>, expressionAttributeNames?: Record<string, string>): Promise<any> {
    try {
      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW'
      });
      const result = await documentClient.send(command);
      logger.debug(`Item updated in ${this.tableName}:`, result.Attributes);
      return result.Attributes;
    } catch (error) {
      logger.error(`Error updating item in ${this.tableName}:`, error);
      throw error;
    }
  }

  // Delete an item
  async delete(key: Record<string, any>): Promise<any> {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: key
      });
      const result = await documentClient.send(command);
      logger.debug(`Item deleted from ${this.tableName}:`, key);
      return result;
    } catch (error) {
      logger.error(`Error deleting item from ${this.tableName}:`, error);
      throw error;
    }
  }

  // Scan all items (use with caution on large tables)
  async scan(filterExpression?: string, expressionAttributeValues?: Record<string, any>, expressionAttributeNames?: Record<string, string>): Promise<any[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames
      });
      const result = await documentClient.send(command);
      return result.Items || [];
    } catch (error) {
      logger.error(`Error scanning ${this.tableName}:`, error);
      throw error;
    }
  }

  // Query items by partition key and optional sort key
  async query(partitionKey: string, partitionValue: any, sortKey?: string, sortValue?: any, indexName?: string): Promise<any[]> {
    try {
      const keyConditionExpression = sortKey 
        ? `${partitionKey} = :pk AND ${sortKey} = :sk`
        : `${partitionKey} = :pk`;
      
      const expressionAttributeValues: Record<string, any> = {
        ':pk': partitionValue
      };
      
      if (sortKey && sortValue) {
        expressionAttributeValues[':sk'] = sortValue;
      }

      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: indexName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
      });
      const result = await documentClient.send(command);
      return result.Items || [];
    } catch (error) {
      logger.error(`Error querying ${this.tableName}:`, error);
      throw error;
    }
  }

  // Batch get items
  async batchGet(keys: Record<string, any>[]): Promise<any[]> {
    try {
      const command = new BatchGetCommand({
        RequestItems: {
          [this.tableName]: {
            Keys: keys
          }
        }
      });
      const result = await documentClient.send(command);
      return result.Responses?.[this.tableName] || [];
    } catch (error) {
      logger.error(`Error batch getting from ${this.tableName}:`, error);
      throw error;
    }
  }

  // Batch write items
  async batchWrite(items: Record<string, any>[]): Promise<any> {
    try {
      const putRequests = items.map(item => ({ PutRequest: { Item: item } }));
      const command = new BatchWriteCommand({
        RequestItems: {
          [this.tableName]: putRequests
        }
      });
      const result = await documentClient.send(command);
      logger.debug(`Batch write completed for ${this.tableName}:`, items.length, 'items');
      return result;
    } catch (error) {
      logger.error(`Error batch writing to ${this.tableName}:`, error);
      throw error;
    }
  }
}
