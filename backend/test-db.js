const { Sequelize } = require('sequelize');

// Test database connection
const sequelize = new Sequelize({
  dialect: 'postgresql',
  host: 'localhost',
  port: 5432,
  database: 'ecommerce',
  username: 'postgres',
  password: 'admin',
  logging: console.log
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test creating a simple table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Table creation successful!');
    
    await sequelize.close();
    console.log('✅ Connection closed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
