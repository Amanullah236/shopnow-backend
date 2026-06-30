const { User, Category, Product } = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Create Admin User
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        phone: '03001234567',
      });
      console.log('✅ Admin user created');
    }

    // 2. Create Categories
    const categories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
        isActive: true,
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing and accessories',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
        isActive: true,
      },
      {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        description: 'Home appliances and kitchenware',
        image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500',
        isActive: true,
      },
      {
        name: 'Books',
        slug: 'books',
        description: 'Books and educational materials',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500',
        isActive: true,
      },
      {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and accessories',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
        isActive: true,
      },
    ];

    for (const cat of categories) {
      const exists = await Category.findOne({ where: { slug: cat.slug } });
      if (!exists) {
        await Category.create(cat);
        console.log(`✅ Category created: ${cat.name}`);
      }
    }

    // 3. Get category IDs
    const electronicsCategory = await Category.findOne({ where: { slug: 'electronics' } });
    const fashionCategory = await Category.findOne({ where: { slug: 'fashion' } });
    const homeCategory = await Category.findOne({ where: { slug: 'home-kitchen' } });
    const booksCategory = await Category.findOne({ where: { slug: 'books' } });
    const sportsCategory = await Category.findOne({ where: { slug: 'sports' } });

    // 4. Create Sample Products
    const products = [
      // Electronics
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'Premium wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
        price: 89.99,
        comparePrice: 129.99,
        categoryId: electronicsCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' }
        ],
        stock: 50,
        sku: 'WH-001',
        brand: 'TechSound',
        tags: ['wireless', 'audio', 'bluetooth'],
        ratings: { average: 4.5, count: 128 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Smart Watch Pro',
        slug: 'smart-watch-pro',
        description: 'Advanced smartwatch with fitness tracking, heart rate monitor, and GPS. Water resistant up to 50 meters.',
        price: 199.99,
        comparePrice: 299.99,
        categoryId: electronicsCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' }
        ],
        stock: 30,
        sku: 'SW-002',
        brand: 'SmartTech',
        tags: ['smartwatch', 'fitness', 'health'],
        ratings: { average: 4.8, count: 256 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Laptop Stand Aluminum',
        slug: 'laptop-stand-aluminum',
        description: 'Ergonomic aluminum laptop stand with adjustable height. Compatible with all laptops up to 17 inches.',
        price: 34.99,
        comparePrice: 49.99,
        categoryId: electronicsCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500' }
        ],
        stock: 100,
        sku: 'LS-003',
        brand: 'DeskMate',
        tags: ['laptop', 'stand', 'office'],
        ratings: { average: 4.3, count: 89 },
        isActive: true,
        isFeatured: false,
      },
      {
        name: 'Wireless Keyboard & Mouse',
        slug: 'wireless-keyboard-mouse',
        description: 'Ultra-slim wireless keyboard and mouse combo. Quiet keys and precise mouse tracking.',
        price: 45.99,
        comparePrice: 65.99,
        categoryId: electronicsCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500' }
        ],
        stock: 75,
        sku: 'KM-004',
        brand: 'TypePro',
        tags: ['keyboard', 'mouse', 'wireless'],
        ratings: { average: 4.6, count: 145 },
        isActive: true,
        isFeatured: true,
      },

      // Fashion
      {
        name: 'Classic Leather Watch',
        slug: 'classic-leather-watch',
        description: 'Elegant leather strap watch with stainless steel case. Perfect for formal and casual occasions.',
        price: 79.99,
        comparePrice: 119.99,
        categoryId: fashionCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500' }
        ],
        stock: 45,
        sku: 'CW-005',
        brand: 'TimeStyle',
        tags: ['watch', 'leather', 'accessories'],
        ratings: { average: 4.4, count: 67 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Denim Jacket',
        slug: 'denim-jacket',
        description: 'Classic blue denim jacket with button closure. Made from premium quality denim fabric.',
        price: 59.99,
        comparePrice: 89.99,
        categoryId: fashionCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' }
        ],
        stock: 60,
        sku: 'DJ-006',
        brand: 'UrbanWear',
        tags: ['jacket', 'denim', 'casual'],
        ratings: { average: 4.7, count: 198 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Sneakers White',
        slug: 'sneakers-white',
        description: 'Comfortable white sneakers with cushioned sole. Perfect for daily wear and light sports.',
        price: 69.99,
        comparePrice: 99.99,
        categoryId: fashionCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500' }
        ],
        stock: 80,
        sku: 'SN-007',
        brand: 'StepFlex',
        tags: ['shoes', 'sneakers', 'white'],
        ratings: { average: 4.5, count: 223 },
        isActive: true,
        isFeatured: false,
      },

      // Home & Kitchen
      {
        name: 'Coffee Maker Automatic',
        slug: 'coffee-maker-automatic',
        description: 'Programmable coffee maker with 12-cup capacity. Keep warm function and auto shut-off.',
        price: 49.99,
        comparePrice: 79.99,
        categoryId: homeCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500' }
        ],
        stock: 40,
        sku: 'CM-008',
        brand: 'BrewMaster',
        tags: ['coffee', 'kitchen', 'appliance'],
        ratings: { average: 4.6, count: 134 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Stainless Steel Cookware Set',
        slug: 'cookware-set-stainless',
        description: '10-piece stainless steel cookware set. Includes pots, pans, and lids. Dishwasher safe.',
        price: 129.99,
        comparePrice: 199.99,
        categoryId: homeCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1584990347449-39b4aa2d8e3b?w=500' }
        ],
        stock: 25,
        sku: 'CS-009',
        brand: 'ChefPro',
        tags: ['cookware', 'kitchen', 'stainless steel'],
        ratings: { average: 4.8, count: 167 },
        isActive: true,
        isFeatured: true,
      },

      // Books
      {
        name: 'The Psychology of Money',
        slug: 'psychology-of-money',
        description: 'Bestselling book about wealth, greed, and happiness. Learn timeless lessons on money and investing.',
        price: 14.99,
        comparePrice: 24.99,
        categoryId: booksCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500' }
        ],
        stock: 100,
        sku: 'BK-010',
        brand: 'Harriman House',
        tags: ['book', 'finance', 'psychology'],
        ratings: { average: 4.9, count: 432 },
        isActive: true,
        isFeatured: true,
      },
      {
        name: 'Atomic Habits',
        slug: 'atomic-habits',
        description: 'An easy and proven way to build good habits and break bad ones. Transform your life one tiny change at a time.',
        price: 16.99,
        comparePrice: 27.99,
        categoryId: booksCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500' }
        ],
        stock: 120,
        sku: 'BK-011',
        brand: 'Avery',
        tags: ['book', 'self-help', 'habits'],
        ratings: { average: 4.8, count: 567 },
        isActive: true,
        isFeatured: true,
      },

      // Sports
      {
        name: 'Yoga Mat Premium',
        slug: 'yoga-mat-premium',
        description: 'Extra thick yoga mat with non-slip surface. Includes carrying strap. Perfect for yoga and pilates.',
        price: 29.99,
        comparePrice: 49.99,
        categoryId: sportsCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500' }
        ],
        stock: 90,
        sku: 'YM-012',
        brand: 'FlexFit',
        tags: ['yoga', 'fitness', 'mat'],
        ratings: { average: 4.7, count: 289 },
        isActive: true,
        isFeatured: false,
      },
      {
        name: 'Dumbbell Set Adjustable',
        slug: 'dumbbell-set-adjustable',
        description: 'Adjustable dumbbell set 5-25kg. Space-saving design with quick weight adjustment system.',
        price: 149.99,
        comparePrice: 229.99,
        categoryId: sportsCategory.id,
        images: [
          { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500' }
        ],
        stock: 35,
        sku: 'DB-013',
        brand: 'PowerGym',
        tags: ['dumbbell', 'fitness', 'weights'],
        ratings: { average: 4.6, count: 178 },
        isActive: true,
        isFeatured: true,
      },
    ];

    for (const product of products) {
      const exists = await Product.findOne({ where: { slug: product.slug } });
      if (!exists) {
        await Product.create(product);
        console.log(`✅ Product created: ${product.name}`);
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📧 Admin Credentials:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

module.exports = seedDatabase;