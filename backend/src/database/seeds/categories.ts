import { Category } from '../../models/Category';

export const seedCategories = async (): Promise<void> => {
  const categories = [
    {
      name: 'Electronics',
      description: 'Electronic devices and gadgets',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
    },
    {
      name: 'Clothing',
      description: 'Fashion and apparel for men, women, and children',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
    },
    {
      name: 'Books',
      description: 'Books, novels, and educational materials',
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
    },
    {
      name: 'Home & Garden',
      description: 'Home improvement and gardening supplies',
      imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
    },
    {
      name: 'Sports',
      description: 'Sports equipment and fitness gear',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    },
    {
      name: 'Beauty',
      description: 'Beauty and personal care products',
      imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
    },
    {
      name: 'Toys',
      description: 'Toys and games for children',
      imageUrl: 'https://images.unsplash.com/photo-1558060370-9d4b4a7a2b5e?w=500',
    },
    {
      name: 'Automotive',
      description: 'Car accessories and automotive parts',
      imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500',
    },
  ];

  for (const categoryData of categories) {
    await Category.findOrCreate({
      where: { name: categoryData.name },
      defaults: categoryData,
    });
  }
};
