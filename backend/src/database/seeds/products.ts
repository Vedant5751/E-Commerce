import { Product, Category } from '../../models';

export const seedProducts = async (): Promise<void> => {
  // Get categories
  const electronics = await Category.findOne({ where: { name: 'Electronics' } });
  const clothing = await Category.findOne({ where: { name: 'Clothing' } });
  const books = await Category.findOne({ where: { name: 'Books' } });
  const home = await Category.findOne({ where: { name: 'Home & Garden' } });
  const sports = await Category.findOne({ where: { name: 'Sports' } });
  const beauty = await Category.findOne({ where: { name: 'Beauty' } });
  const toys = await Category.findOne({ where: { name: 'Toys' } });
  const automotive = await Category.findOne({ where: { name: 'Automotive' } });

  const products = [
    // Electronics
    {
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with advanced camera system and A17 Pro chip',
      price: 134900.00,
      categoryId: electronics?.id,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      sku: 'IPH15PRO-128',
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Premium Android smartphone with S Pen and advanced AI features',
      price: 124999.00,
      categoryId: electronics?.id,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
      sku: 'SGS24U-256',
    },
    {
      name: 'MacBook Air M3',
      description: 'Ultra-thin laptop with M3 chip for exceptional performance',
      price: 114900.00,
      categoryId: electronics?.id,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
      sku: 'MBA-M3-256',
    },

    // Clothing
    {
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with Air Max technology',
      price: 12995.00,
      categoryId: clothing?.id,
      stock: 100,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      sku: 'NIKE-AM270-BLK',
    },
    {
      name: 'Levi\'s 501 Original Jeans',
      description: 'Classic straight-fit jeans in authentic denim',
      price: 3995.00,
      categoryId: clothing?.id,
      stock: 75,
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
      sku: 'LEVI-501-BLU',
    },

    // Books
    {
      name: 'Atomic Habits by James Clear',
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
      price: 399.00,
      categoryId: books?.id,
      stock: 200,
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
      sku: 'BOOK-ATOMIC-HABITS',
    },
    {
      name: 'The Psychology of Money',
      description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel',
      price: 299.00,
      categoryId: books?.id,
      stock: 150,
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
      sku: 'BOOK-PSYCH-MONEY',
    },

    // Home & Garden
    {
      name: 'Philips Air Fryer HD9200',
      description: 'Healthy cooking with 4.1L capacity and rapid air technology',
      price: 8995.00,
      categoryId: home?.id,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
      sku: 'PHILIPS-AF9200',
    },
    {
      name: 'Dyson V15 Detect Vacuum',
      description: 'Cordless vacuum with laser dust detection and powerful suction',
      price: 49995.00,
      categoryId: home?.id,
      stock: 20,
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      sku: 'DYSON-V15-DETECT',
    },

    // Sports
    {
      name: 'Adidas Football',
      description: 'Official match football with premium leather construction',
      price: 2495.00,
      categoryId: sports?.id,
      stock: 60,
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
      sku: 'ADIDAS-FB-OFFICIAL',
    },
  ];

  for (const productData of products) {
    if (productData.categoryId) {
      await Product.findOrCreate({
        where: { sku: productData.sku },
        defaults: productData,
      });
    }
  }
};
