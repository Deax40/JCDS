const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Simple .env parser to avoid external dependency
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = value;
          }
        }
      });
      console.log('✅ Loaded .env file');
    }
  } catch (e) {
    console.log('Info: Could not load .env file directly:', e.message);
  }
}

loadEnv();

async function checkConnection() {
  console.log('Checking database connection...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not defined in environment variables.');
    console.log('👉 Please create a .env file with DATABASE_URL=...');
    process.exit(1);
  }

  console.log('DATABASE_URL is set (masked):', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('supabase.co') ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 5000,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to the database!');

    const result = await client.query('SELECT NOW() as now, current_user, current_database()');
    console.log('Database time:', result.rows[0].now);
    console.log('Current user:', result.rows[0].current_user);
    console.log('Current database:', result.rows[0].current_database);

    client.release();
    await pool.end();
    console.log('✅ Connection test passed.');
  } catch (err) {
    console.error('❌ Database connection failed:');
    console.error(err.message);
    if (err.code) console.error('Error code:', err.code);

    if (err.message.includes('Tenant or user not found') || err.code === 'XX000') {
        console.log('\nPossible causes for "Tenant or user not found":');
        console.log('1. The Supabase project is paused or deleted.');
        console.log('2. The Project ID in the URL is incorrect.');
        console.log('3. You are using a wrong database user.');
    }

    await pool.end();
    process.exit(1);
  }
}

checkConnection();
