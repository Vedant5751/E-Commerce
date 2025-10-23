import { CategoryModel } from '../../models/Category';
import { ProductModel } from '../../models/Product';
import { connectDatabase } from '../../config/database';
import { logger } from '../../utils/logger';

const categoryModel = new CategoryModel();
const productModel = new ProductModel();

const categories = [
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets'
  },
  {
    name: 'Clothing',
    description: 'Fashion and apparel'
  },
  {
    name: 'Books',
    description: 'Books and educational materials'
  },
  {
    name: 'Home & Garden',
    description: 'Home improvement and gardening'
  },
  {
    name: 'Sports',
    description: 'Sports and fitness equipment'
  }
];

const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced camera system',
    price: 99999,
    stock: 50,
    image_url: 'https://example.com/iphone15pro.jpg'
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Premium Android smartphone',
    price: 89999,
    stock: 30,
    image_url: 'https://example.com/galaxy-s24.jpg'
  },
  {
    name: 'MacBook Air M3',
    description: 'Ultra-thin laptop with M3 chip',
    price: 129999,
    stock: 25,
    image_url: 'https://example.com/macbook-air-m3.jpg'
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes',
    price: 12999,
    stock: 100,
    image_url: 'https://example.com/nike-air-max-270.jpg'
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'High-performance running shoes',
    price: 15999,
    stock: 75,
    image_url: 'https://example.com/adidas-ultraboost-22.jpg'
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 299,
    stock: 200,
    image_url: 'https://example.com/great-gatsby.jpg'
  },
  {
    name: 'Clean Code',
    description: 'A Handbook of Agile Software Craftsmanship',
    price: 1299,
    stock: 150,
    image_url: 'https://example.com/clean-code.jpg'
  },
  {
    name: 'Coffee Maker',
    description: 'Automatic drip coffee maker',
    price: 3999,
    stock: 40,
    image_url: 'https://example.com/coffee-maker.jpg'
  },
  {
    name: 'Garden Tools Set',
    description: 'Complete set of gardening tools',
    price: 2499,
    stock: 60,
    image_url: 'https://example.com/garden-tools.jpg'
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for exercise',
    price: 1999,
    stock: 80,
    image_url: 'https://example.com/yoga-mat.jpg'
  }
];

async function seedDatabase() {
  try {
    await connectDatabase();
    logger.info('Starting database seeding...');

    // Create categories
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await categoryModel.create(categoryData);
      createdCategories.push(category);
      logger.info(`Created category: ${category.name}`);
    }

    // Create products
    for (let i = 0; i < products.length; i++) {
      const productData = products[i];
      const categoryIndex = i % createdCategories.length; // Distribute products across categories
      
      const product = await productModel.create({
        ...productData,
        category_id: createdCategories[categoryIndex].id
      });
      
      logger.info(`Created product: ${product.name} in category: ${createdCategories[categoryIndex].name}`);
    }

    logger.info('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
