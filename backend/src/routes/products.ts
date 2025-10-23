import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import { ProductModel } from '../models/Product';
import { CategoryModel } from '../models/Category';
import { AuthRequest, requireAdmin, optionalAuth } from '../middleware/auth';
import { createError, asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const router = express.Router();
const productModel = new ProductModel();
const categoryModel = new CategoryModel();

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products with pagination and filtering
 *     tags: [Products]
 *     parameters:
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in product name and description
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be a positive number'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be a positive number'),
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const {
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    search,
  } = req.query;

  const offset = (Number(page) - 1) * Number(limit);
  const whereClause: any = { isActive: true };

  // Apply filters
  if (category) {
    const categories = await categoryModel.findAll();
    const categoryRecord = categories.find(c => c.name === category);
    if (categoryRecord) {
      whereClause.category_id = categoryRecord.id;
    }
  }

  if (minPrice || maxPrice) {
    whereClause.price = {};
    if (minPrice) whereClause.price[Symbol.for('gte')] = Number(minPrice);
    if (maxPrice) whereClause.price[Symbol.for('lte')] = Number(maxPrice);
  }

  if (search) {
    whereClause[Symbol.for('or')] = [
      { name: { [Symbol.for('iLike')]: `%${search}%` } },
      { description: { [Symbol.for('iLike')]: `%${search}%` } },
    ];
  }

  const allProducts = await productModel.findAll();
  const filteredProducts = allProducts.filter(product => {
    if (!whereClause.isActive) return true;
    if (whereClause.category_id && product.category_id !== whereClause.category_id) return false;
    if (whereClause.minPrice && product.price < whereClause.minPrice) return false;
    if (whereClause.maxPrice && product.price > whereClause.maxPrice) return false;
    return true;
  });
  
  const products = filteredProducts.slice(offset, offset + Number(limit));
  const count = filteredProducts.length;

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

  res.json({
    success: true,
    data: {
      items: transformedProducts,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(count / Number(limit)),
        totalItems: count,
        hasNextPage: Number(page) < Math.ceil(count / Number(limit)),
        hasPrevPage: Number(page) > 1,
      },
    },
  });
}));

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
], asyncHandler(async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    throw createError('Product not found', 404);
  }

  // Transform product to match frontend expectations
  const transformedProduct = {
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
  };

  res.json({
    success: true,
    data: {
      product: transformedProduct,
    },
  });
}));

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - categoryId
 *               - stock
 *               - imageUrl
 *               - sku
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *               categoryId:
 *                 type: integer
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               sku:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', [
  requireAdmin,
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('description').notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('imageUrl').isURL().withMessage('Valid image URL required'),
  body('sku').isLength({ min: 3, max: 50 }).withMessage('SKU must be 3-50 characters'),
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { name, description, price, categoryId, stock, imageUrl, sku } = req.body;

  // Check if category exists
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    throw createError('Category not found', 404);
  }

  // Check if SKU already exists (simplified - no SKU field in DynamoDB model)
  const allProducts = await productModel.findAll();
  const existingProduct = allProducts.find(p => p.name === name);
  if (existingProduct) {
    throw createError('Product with this name already exists', 409);
  }

  const product = await productModel.create({
    name,
    description,
    price,
    category_id: categoryId,
    stock,
    image_url: imageUrl,
  });

  logger.info(`Product created: ${product.name} by ${req.user?.email}`);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: {
      product,
    },
  });
}));

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *               categoryId:
 *                 type: integer
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.put('/:id', [
  requireAdmin,
  param('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('categoryId').optional().isInt({ min: 1 }).withMessage('Category ID must be a positive integer'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('imageUrl').optional().isURL().withMessage('Valid image URL required'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createError('Validation failed', 400);
  }

  const { id } = req.params;
  const updateData = req.body;

  const product = await productModel.findById(id);
  if (!product) {
    throw createError('Product not found', 404);
  }

  // Check if category exists (if category_id is being updated)
  if (updateData.category_id) {
    const category = await categoryModel.findById(updateData.category_id);
    if (!category) {
      throw createError('Category not found', 404);
    }
  }

  await productModel.update(id, updateData);

  logger.info(`Product updated: ${product.name} by ${req.user?.email}`);

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: {
      product,
    },
  });
}));

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.delete('/:id', [
  requireAdmin,
  param('id').isInt({ min: 1 }).withMessage('Product ID must be a positive integer'),
], asyncHandler(async (req: AuthRequest, res: express.Response) => {
  const { id } = req.params;

  const product = await productModel.findById(id);
  if (!product) {
    throw createError('Product not found', 404);
  }

  // Delete the product
  await productModel.delete(id);

  logger.info(`Product deleted: ${product.name} by ${req.user?.email}`);

  res.json({
    success: true,
    message: 'Product deleted successfully',
  });
}));

export default router;
