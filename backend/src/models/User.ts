import { DynamoDBService } from '../services/dynamodb';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const USERS_TABLE = process.env.USERS_TABLE || 'ecommerce-development-users';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

export class UserModel {
  private db: DynamoDBService;

  constructor() {
    this.db = new DynamoDBService(USERS_TABLE);
  }

  async create(userData: CreateUserData): Promise<User> {
    const id = uuidv4();
    const password_hash = await bcrypt.hash(userData.password, 12);
    const now = new Date().toISOString();

    const user: User = {
      id,
      email: userData.email.toLowerCase(),
      password_hash,
      name: userData.name,
      created_at: now,
      updated_at: now
    };

    await this.db.put(user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.db.get({ id });
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.db.query('email', email.toLowerCase(), undefined, undefined, 'email-index');
    return users.length > 0 ? users[0] : null;
  }

  async update(id: string, updateData: UpdateUserData): Promise<User | null> {
    let updateExpression = 'SET updated_at = :updated_at';
    const expressionAttributeValues: Record<string, any> = {
      ':updated_at': new Date().toISOString()
    };

    if (updateData.name) {
      updateExpression += ', #name = :name';
      expressionAttributeValues[':name'] = updateData.name;
    }


    if (updateData.email) {
      updateExpression += ', email = :email';
      expressionAttributeValues[':email'] = updateData.email.toLowerCase();
    }

    const expressionAttributeNames: Record<string, string> = {};
    if (updateData.name) {
      expressionAttributeNames['#name'] = 'name';
    }

    const updatedUser = await this.db.update(
      { id },
      updateExpression,
      expressionAttributeValues,
      Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined
    );

    return updatedUser;
  }

  async updatePassword(id: string, newPassword: string): Promise<User | null> {
    const password_hash = await bcrypt.hash(newPassword, 12);
    
    const updatedUser = await this.db.update(
      { id },
      'SET password_hash = :password_hash, updated_at = :updated_at',
      {
        ':password_hash': password_hash,
        ':updated_at': new Date().toISOString()
      }
    );

    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.delete({ id });
      return true;
    } catch (error) {
      return false;
    }
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password_hash);
  }

  // Remove sensitive data before returning user
  toSafeUser(user: User): Omit<User, 'password_hash'> {
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }
}