import { DynamoDBService } from '../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const ORDERS_TABLE = process.env.ORDERS_TABLE || 'ecommerce-development-orders';
const ORDER_ITEMS_TABLE = process.env.ORDER_ITEMS_TABLE || 'ecommerce-development-order-items';

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  order_id: string;
  product_id: string;
  quantity: number;
  price: number; // Price at time of order
  created_at: string;
}

export interface CreateOrderData {
  user_id: string;
  total_amount: number;
  shipping_address: {
    name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateOrderData {
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address?: {
    name: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export class OrderModel {
  private db: DynamoDBService;
  private orderItemsDb: DynamoDBService;

  constructor() {
    this.db = new DynamoDBService(ORDERS_TABLE);
    this.orderItemsDb = new DynamoDBService(ORDER_ITEMS_TABLE);
  }

  async create(orderData: CreateOrderData): Promise<Order> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const order: Order = {
      id,
      user_id: orderData.user_id,
      total_amount: orderData.total_amount,
      status: 'pending',
      shipping_address: orderData.shipping_address,
      created_at: now,
      updated_at: now
    };

    // Create order
    await this.db.put(order);

    // Create order items
    const orderItems: OrderItem[] = orderData.items.map(item => ({
      order_id: id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      created_at: now
    }));

    await this.orderItemsDb.batchWrite(orderItems);

    return order;
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.db.get({ id });
    return order || null;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return await this.db.query('user_id', userId, undefined, undefined, 'user-index');
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await this.orderItemsDb.query('order_id', orderId);
  }

  async update(id: string, updateData: UpdateOrderData): Promise<Order | null> {
    let updateExpression = 'SET updated_at = :updated_at';
    const expressionAttributeValues: Record<string, any> = {
      ':updated_at': new Date().toISOString()
    };

    if (updateData.status) {
      updateExpression += ', #status = :status';
      expressionAttributeValues[':status'] = updateData.status;
    }

    if (updateData.shipping_address) {
      updateExpression += ', shipping_address = :shipping_address';
      expressionAttributeValues[':shipping_address'] = updateData.shipping_address;
    }

    const expressionAttributeNames: Record<string, string> = {};
    if (updateData.status) {
      expressionAttributeNames['#status'] = 'status';
    }

    const updatedOrder = await this.db.update(
      { id },
      updateExpression,
      expressionAttributeValues,
      Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined
    );

    return updatedOrder;
  }

  async updateStatus(id: string, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'): Promise<Order | null> {
    const updatedOrder = await this.db.update(
      { id },
      'SET #status = :status, updated_at = :updated_at',
      {
        ':status': status,
        ':updated_at': new Date().toISOString()
      },
      { '#status': 'status' }
    );

    return updatedOrder;
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Delete order items first
      const orderItems = await this.getOrderItems(id);
      const deletePromises = orderItems.map(item => 
        this.orderItemsDb.delete({ order_id: item.order_id, product_id: item.product_id })
      );
      await Promise.all(deletePromises);

      // Delete order
      await this.db.delete({ id });
      return true;
    } catch (error) {
      return false;
    }
  }

  async getOrderWithItems(id: string): Promise<{ order: Order; items: OrderItem[] } | null> {
    const order = await this.findById(id);
    if (!order) return null;

    const items = await this.getOrderItems(id);
    return { order, items };
  }
}