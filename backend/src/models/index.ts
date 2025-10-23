import { User } from './User';
import { Category } from './Category';
import { Product } from './Product';
import { CartItem } from './CartItem';
import { Order } from './Order';
import { OrderItem } from './OrderItem';

// Define associations
export const setupAssociations = (): void => {
  // User associations
  User.hasMany(CartItem, { foreignKey: 'userId', as: 'cartItems' });
  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

  // Category associations
  Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

  // Product associations
  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
  Product.hasMany(CartItem, { foreignKey: 'productId', as: 'cartItems' });
  Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });

  // CartItem associations
  CartItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  CartItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // Order associations
  Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'orderItems' });

  // OrderItem associations
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
};

// Initialize associations
setupAssociations();

export {
  User,
  Category,
  Product,
  CartItem,
  Order,
  OrderItem,
};
