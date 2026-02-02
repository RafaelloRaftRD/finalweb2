const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const products = [
  {
    name: 'Espresso',
    description: 'Strong and bold Italian coffee',
    price: 500,
    category: 'hot-drinks',
    available: true
  },
  {
    name: 'Americano',
    description: 'Espresso with hot water',
    price: 700,
    category: 'hot-drinks',
    available: true
  },
  {
    name: 'Latte',
    description: 'Smooth espresso with steamed milk',
    price: 900,
    category: 'hot-drinks',
    available: true
  },
  {
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 900,
    category: 'hot-drinks',
    available: true
  },
  {
    name: 'Raf Coffee',
    description: 'Creamy coffee with vanilla',
    price: 1000,
    category: 'hot-drinks',
    available: true
  },
  {
    name: 'Irish Coffee',
    description: 'Coffee with Irish whiskey and cream',
    price: 2000,
    category: 'hot-drinks',
    available: true
  },
  {
    name: 'Iced Americano',
    description: 'Cold espresso with water over ice',
    price: 850,
    category: 'cold-drinks',
    available: true
  },
  {
    name: 'Iced Latte',
    description: 'Cold espresso with milk over ice',
    price: 950,
    category: 'cold-drinks',
    available: true
  },
  {
    name: 'Croissant',
    description: 'Buttery French pastry',
    price: 1500,
    category: 'pastries',
    available: true
  },
  {
    name: 'Blueberry Muffin',
    description: 'Freshly baked muffin',
    price: 1250,
    category: 'pastries',
    available: true
  },
  {
    name: 'Chocolate Cookie',
    description: 'Homemade chocolate chip cookie',
    price: 1000,
    category: 'snacks',
    available: true
  }
];

async function addProducts() {
  try {
    await Product.deleteMany({});
    console.log('🗑️  Old products deleted');
    
    await Product.insertMany(products);
    console.log('✅ Products added successfully!');
    console.log(`📦 Total products: ${products.length}`);
    
    console.log('\n💰 Prices:');
    products.forEach(p => {
      console.log(`   ${p.name}: ${p.price}₸`);
    });
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addProducts();