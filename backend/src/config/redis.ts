import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

const { REDIS_URL, REDIS_HOST, REDIS_PORT } = process.env;

let redisClient: RedisClientType | null = null;

export const connectRedis = async (): Promise<void> => {
  try {
    // Skip Redis connection if environment variables are not set (for local development)
    if (!REDIS_URL && (!REDIS_HOST || !REDIS_PORT)) {
      logger.info('Redis connection skipped - environment variables not set');
      return;
    }

    redisClient = createClient({
      url: REDIS_URL || `redis://${REDIS_HOST}:${REDIS_PORT}`,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 500),
      },
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });

    redisClient.on('end', () => {
      logger.info('Redis client disconnected');
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    // Don't throw error for local development
    logger.info('Continuing without Redis connection');
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redisClient) {
      await redisClient.quit();
      logger.info('Redis connection closed');
    }
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType | null => {
  return redisClient;
};

export default getRedisClient;
