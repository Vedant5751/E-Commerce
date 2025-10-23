import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const dynamodb = new AWS.DynamoDB.DocumentClient();

// Table names
export const TABLES = {
  USERS: process.env.USERS_TABLE || 'ecommerce-development-users',
  CATEGORIES: process.env.CATEGORIES_TABLE || 'ecommerce-development-categories',
  PRODUCTS: process.env.PRODUCTS_TABLE || 'ecommerce-development-products',
  CART_ITEMS: process.env.CART_ITEMS_TABLE || 'ecommerce-development-cart-items',
  ORDERS: process.env.ORDERS_TABLE || 'ecommerce-development-orders',
  ORDER_ITEMS: process.env.ORDER_ITEMS_TABLE || 'ecommerce-development-order-items',
};

// Helper function to generate UUID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to get current timestamp
export const getCurrentTimestamp = (): number => {
  return Date.now();
};
