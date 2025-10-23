import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();

// Simple in-memory cart for demo purposes
const demoCart: { [key: string]: { productId: number; quantity: number; name: string; price: number; imageUrl: string } } = {};

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get user's cart items
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 */
router.get('/', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  console.log('Demo: Getting cart items for demo user');
  
  // Convert demo cart to array format
  const cartItems = Object.values(demoCart).map(item => ({
    id: `demo-${item.productId}`,
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
    product: {
      id: item.productId,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      stock: 100, // Demo stock
    }
  }));
  
  res.json({
    success: true,
    data: { cartItems }
  });
}));

/**
 * @swagger
 * /api/v1/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Validation error or insufficient stock
 *       404:
 *         description: Product not found
 */
router.post('/', [
  body('productId').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { productId, quantity } = req.body;

  // Demo product data (in real app, this would come from database)
  const demoProducts: { [key: number]: { name: string; price: number; imageUrl: string } } = {
    1: { name: 'iPhone 15 Pro', price: 99999, imageUrl: 'https://example.com/iphone15pro.jpg' },
    2: { name: 'Samsung Galaxy S24', price: 89999, imageUrl: 'https://example.com/galaxy-s24.jpg' },
    3: { name: 'MacBook Air M3', price: 129999, imageUrl: 'https://example.com/macbook-air-m3.jpg' },
    4: { name: 'Nike Air Max 270', price: 12999, imageUrl: 'https://example.com/nike-air-max-270.jpg' },
    5: { name: 'Adidas Ultraboost 22', price: 15999, imageUrl: 'https://example.com/adidas-ultraboost-22.jpg' },
    6: { name: 'The Great Gatsby', price: 299, imageUrl: 'https://example.com/great-gatsby.jpg' },
    7: { name: 'Clean Code', price: 1299, imageUrl: 'https://example.com/clean-code.jpg' },
    8: { name: 'Coffee Maker', price: 3999, imageUrl: 'https://example.com/coffee-maker.jpg' },
    9: { name: 'Garden Tools Set', price: 2499, imageUrl: 'https://example.com/garden-tools.jpg' },
    10: { name: 'Yoga Mat', price: 1999, imageUrl: 'https://example.com/yoga-mat.jpg' }
  };

  const product = demoProducts[productId];
  if (!product) {
    throw createError('Product not found', 404);
  }

  const cartKey = productId.toString();
  
  if (demoCart[cartKey]) {
    // Update existing item
    demoCart[cartKey].quantity += quantity;
  } else {
    // Add new item
    demoCart[cartKey] = {
      productId,
      quantity,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl
    };
  }

  console.log(`Demo: Adding product ${productId} (quantity: ${quantity}) to cart for demo user`);
  
  res.json({
    success: true,
    message: 'Item added to cart successfully',
  });
}));

/**
 * @swagger
 * /api/v1/cart/{productId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Validation error or insufficient stock
 *       404:
 *         description: Cart item not found
 */
router.put('/:productId', [
  param('productId').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { productId } = req.params;
  const { quantity } = req.body;

  const cartKey = productId.toString();
  
  if (!demoCart[cartKey]) {
    throw createError('Cart item not found', 404);
  }

  demoCart[cartKey].quantity = quantity;
  
  console.log(`Demo: Updating cart item ${productId} quantity to ${quantity}`);
  
  res.json({
    success: true,
    message: 'Cart item updated successfully',
  });
}));

/**
 * @swagger
 * /api/v1/cart/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Cart item not found
 */
router.delete('/:productId', [
  param('productId').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { productId } = req.params;
  const cartKey = productId.toString();
  
  if (!demoCart[cartKey]) {
    throw createError('Cart item not found', 404);
  }

  delete demoCart[cartKey];
  
  console.log(`Demo: Removing cart item ${productId}`);
  
  res.json({
    success: true,
    message: 'Item removed from cart successfully',
  });
}));

/**
 * @swagger
 * /api/v1/cart/clear:
 *   delete:
 *     summary: Clear all cart items
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete('/clear', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  // Clear all items from demo cart
  Object.keys(demoCart).forEach(key => delete demoCart[key]);
  
  console.log('Demo: Clearing cart for demo user');
  
  res.json({
    success: true,
    message: 'Cart cleared successfully',
  });
}));

export default router;