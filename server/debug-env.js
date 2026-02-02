const fs = require('fs');
const path = require('path');

// Manual .env parsing
const envPath = path.resolve(__dirname, '../.env');
console.log('Reading .env from:', envPath);

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('Raw .env content:');
  console.log(envContent);
  
  // Parse manually
  const lines = envContent.split('\n');
  lines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=');
      process.env[key] = value;
      console.log(`Set ${key} = ${value}`);
    }
  });
  
  console.log('\nAfter manual parsing:');
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD || '(empty)');
  console.log('DB_NAME:', process.env.DB_NAME);
  
} catch (error) {
  console.error('Error reading .env:', error);
}
