import { DynamoDBService } from '../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'ecommerce-development-products';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Price in INR
  category_id: string;
  stock: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  stock: number;
  image_url?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category_id?: string;
  stock?: number;
  image_url?: string;
}

export interface ProductFilters {
  category_id?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
}

export class ProductModel {
  private db: DynamoDBService;

  constructor() {
    this.db = new DynamoDBService(PRODUCTS_TABLE);
  }

  async create(productData: CreateProductData): Promise<Product> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const product: Product = {
      id,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      category_id: productData.category_id,
      stock: productData.stock,
      image_url: productData.image_url,
      created_at: now,
      updated_at: now
    };

    await this.db.put(product);
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.db.get({ id });
    return product || null;
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    return await this.db.query('category_id', categoryId, undefined, undefined, 'category-index');
  }

  async findAll(filters?: ProductFilters, limit?: number, offset?: number): Promise<Product[]> {
    let products = await this.db.scan();

    // Apply filters
    if (filters) {
      if (filters.category_id) {
        products = products.filter(p => p.category_id === filters.category_id);
      }
      if (filters.min_price !== undefined) {
        products = products.filter(p => p.price >= filters.min_price!);
      }
      if (filters.max_price !== undefined) {
        products = products.filter(p => p.price <= filters.max_price!);
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchTerm) || 
          p.description.toLowerCase().includes(searchTerm)
        );
      }
    }

    // Apply pagination
    if (offset) {
      products = products.slice(offset);
    }
    if (limit) {
      products = products.slice(0, limit);
    }

    return products;
  }

  async update(id: string, updateData: UpdateProductData): Promise<Product | null> {
    let updateExpression = 'SET updated_at = :updated_at';
    const expressionAttributeValues: Record<string, any> = {
      ':updated_at': new Date().toISOString()
    };

    if (updateData.name) {
      updateExpression += ', #name = :name';
      expressionAttributeValues[':name'] = updateData.name;
    }

    if (updateData.description) {
      updateExpression += ', description = :description';
      expressionAttributeValues[':description'] = updateData.description;
    }

    if (updateData.price !== undefined) {
      updateExpression += ', price = :price';
      expressionAttributeValues[':price'] = updateData.price;
    }

    if (updateData.category_id) {
      updateExpression += ', category_id = :category_id';
      expressionAttributeValues[':category_id'] = updateData.category_id;
    }

    if (updateData.stock !== undefined) {
      updateExpression += ', stock = :stock';
      expressionAttributeValues[':stock'] = updateData.stock;
    }

    if (updateData.image_url !== undefined) {
      updateExpression += ', image_url = :image_url';
      expressionAttributeValues[':image_url'] = updateData.image_url;
    }

    const expressionAttributeNames: Record<string, string> = {};
    if (updateData.name) {
      expressionAttributeNames['#name'] = 'name';
    }

    const updatedProduct = await this.db.update(
      { id },
      updateExpression,
      expressionAttributeValues,
      Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined
    );

    return updatedProduct;
  }

  async updateStock(id: string, newStock: number): Promise<Product | null> {
    const updatedProduct = await this.db.update(
      { id },
      'SET stock = :stock, updated_at = :updated_at',
      {
        ':stock': newStock,
        ':updated_at': new Date().toISOString()
      }
    );

    return updatedProduct;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.delete({ id });
      return true;
    } catch (error) {
      return false;
    }
  }

  async search(searchTerm: string, limit?: number): Promise<Product[]> {
    const products = await this.db.scan();
    const searchLower = searchTerm.toLowerCase();
    
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower)
    );

    return limit ? filteredProducts.slice(0, limit) : filteredProducts;
  }
}