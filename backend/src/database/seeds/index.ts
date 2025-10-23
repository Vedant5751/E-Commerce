import { sequelize } from '../../config/database';
import { seedCategories } from './categories';
import { seedProducts } from './products';
import { logger } from '../../utils/logger';

export const runSeeds = async (): Promise<void> => {
  try {
    logger.info('Starting database seeding...');

    // Seed categories first
    await seedCategories();
    logger.info('Categories seeded successfully');

    // Seed products
    await seedProducts();
    logger.info('Products seeded successfully');

    logger.info('Database seeding completed successfully');
  } catch (error) {
    logger.error('Error during database seeding:', error);
    throw error;
  }
};

// Run seeds if this file is executed directly
if (require.main === module) {
  runSeeds()
    .then(() => {
      logger.info('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Seeding failed:', error);
      process.exit(1);
    });
}
