import { DynamoDBService } from '../services/dynamodb';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES_TABLE = process.env.CATEGORIES_TABLE || 'ecommerce-development-categories';

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryData {
  name: string;
  description: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export class CategoryModel {
  private db: DynamoDBService;

  constructor() {
    this.db = new DynamoDBService(CATEGORIES_TABLE);
  }

  async create(categoryData: CreateCategoryData): Promise<Category> {
    const id = uuidv4();
    const now = new Date().toISOString();

    const category: Category = {
      id,
      name: categoryData.name,
      description: categoryData.description,
      created_at: now,
      updated_at: now
    };

    await this.db.put(category);
    return category;
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.db.get({ id });
    return category || null;
  }

  async findAll(): Promise<Category[]> {
    return await this.db.scan();
  }

  async update(id: string, updateData: UpdateCategoryData): Promise<Category | null> {
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

    const expressionAttributeNames: Record<string, string> = {};
    if (updateData.name) {
      expressionAttributeNames['#name'] = 'name';
    }

    const updatedCategory = await this.db.update(
      { id },
      updateExpression,
      expressionAttributeValues,
      Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined
    );

    return updatedCategory;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.delete({ id });
      return true;
    } catch (error) {
      return false;
    }
  }
}