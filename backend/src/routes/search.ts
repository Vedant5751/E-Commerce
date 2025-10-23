import express from 'express';
import { query, validationResult } from 'express-validator';
import { ProductModel } from '../models/Product';
import { CategoryModel } from '../models/Category';
import { AuthRequest } from '../middleware/auth';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();
const productModel = new ProductModel();
const categoryModel = new CategoryModel();

/**
 * @swagger
 * /api/v1/search:
 *   get:
 *     summary: Search products
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of products per page
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 */
router.get('/', [
  query('q').optional().isString().withMessage('Search query must be a string'),
  query('category').optional().isString().withMessage('Category must be a string'),
  query('minPrice').optional().isNumeric().withMessage('Min price must be a number'),
  query('maxPrice').optional().isNumeric().withMessage('Max price must be a number'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { q, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  // Simplified search logic
  const allProducts = await productModel.findAll();
  let filteredProducts = allProducts;

  // Apply search query
  if (q) {
    const searchQuery = (q as string).toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.description?.toLowerCase().includes(searchQuery)
    );
  }

  // Apply category filter
  if (category) {
    const categories = await categoryModel.findAll();
    const categoryRecord = categories.find(c => c.name === category);
    if (categoryRecord) {
      filteredProducts = filteredProducts.filter(product => 
        product.category_id === categoryRecord.id
      );
    }
  }

  // Apply price filters
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= Number(minPrice)
    );
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.price <= Number(maxPrice)
    );
  }

  // Apply pagination
  const offset = (Number(page) - 1) * Number(limit);
  const products = filteredProducts.slice(offset, offset + Number(limit));

  // Transform products to match frontend expectations
  const transformedProducts = products.map(product => ({
    id: parseInt(product.id),
    name: product.name,
    description: product.description,
    price: product.price,
    categoryId: parseInt(product.category_id),
    stock: product.stock,
    imageUrl: product.image_url || '',
    sku: `SKU-${product.id}`,
    isActive: true,
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  }));

  logger.info(`Search performed: query="${q}", category="${category}", results=${products.length}`);

  res.json({
    success: true,
    data: {
      items: transformedProducts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(filteredProducts.length / Number(limit)),
        totalItems: filteredProducts.length,
        hasNextPage: Number(page) < Math.ceil(filteredProducts.length / Number(limit)),
        hasPrevPage: Number(page) > 1,
      }
    }
  });
}));

/**
 * @swagger
 * /api/v1/search/suggestions:
 *   get:
 *     summary: Get search suggestions
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search suggestions retrieved successfully
 */
router.get('/suggestions', [
  query('q').notEmpty().withMessage('Search query is required'),
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { q } = req.query;

  // Simplified suggestions
  const suggestions = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports'
  ].filter(item => 
    item.toLowerCase().includes((q as string).toLowerCase())
  );

  res.json({
    success: true,
    data: { suggestions }
  });
}));

/**
 * @swagger
 * /api/v1/search/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */
router.get('/categories', asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const categories = await categoryModel.findAll();

  // Transform categories to match frontend expectations
  const transformedCategories = categories.map(category => ({
    id: parseInt(category.id),
    name: category.name,
    description: category.description || '',
    imageUrl: '', // Categories don't have images in our model
    isActive: true,
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  }));

  res.json({
    success: true,
    data: { categories: transformedCategories }
  });
}));

export default router;
