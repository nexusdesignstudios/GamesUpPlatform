const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from the .env file
const envPath = path.resolve(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

// If not found, try current directory
if (result.error && result.error.code === 'ENOENT') {
  console.log('📁 .env not found in parent, trying current directory...');
  const currentEnvPath = path.resolve(__dirname, '.env');
  const currentResult = dotenv.config({ path: currentEnvPath });
  if (!currentResult.error) {
    console.log('✅ .env loaded from current directory:', currentEnvPath);
  } else {
    console.log('❌ .env not found in current directory either');
  }
}

if (result.error) {
  console.error('Dotenv error:', result.error);
} else {
  console.log('✅ .env loaded successfully');
}

console.log('\nDatabase Config:');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD || '(empty)');
console.log('Database:', process.env.DB_NAME);
console.log('Port:', process.env.DB_PORT || 3306);

(async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });
    
    console.log('✅ SUCCESS: Database connection established!');
    const [rows] = await connection.query('SELECT NOW() as now');
    console.log('⏰ Database Time:', rows[0].now);
    await connection.end();
  } catch (error) {
    console.error('❌ FAILURE: Connection failed -', error.message);
    if (process.env.DB_HOST !== 'localhost') {
      console.log('💡 Note: Production database connection may only work on Hostinger servers');
    }
  }
})();
