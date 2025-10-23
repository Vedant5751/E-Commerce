require('dotenv').config({ path: './.env' });
const { Sequelize } = require('sequelize');

// Connect to postgres database first to create our database
const sequelize = new Sequelize({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: 'postgres', // Connect to default postgres database
  dialect: 'postgres',
  logging: false,
});

async function createDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to RDS instance');
    
    // Create the ecommerce database
    await sequelize.query('CREATE DATABASE ecommerce;');
    console.log('✅ Database "ecommerce" created successfully!');
    
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Database "ecommerce" already exists!');
    } else {
      console.error('❌ Error creating database:', error.message);
    }
  } finally {
    await sequelize.close();
  }
}

createDatabase();
