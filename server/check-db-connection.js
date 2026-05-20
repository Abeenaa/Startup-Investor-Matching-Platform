#!/usr/bin/env node

/**
 * Database Connection Checker
 * Run this script to diagnose database connection issues
 * 
 * Usage: node check-db-connection.js
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env' });

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function checkConnection() {
  console.log('\n' + '='.repeat(60));
  log(colors.cyan, '🔍 Database Connection Diagnostic Tool');
  console.log('='.repeat(60) + '\n');

  // Check if DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    log(colors.red, '❌ DATABASE_URL not found in .env file');
    log(colors.yellow, '\n💡 Solution:');
    console.log('   1. Make sure you have a .env file in the server directory');
    console.log('   2. Add DATABASE_URL to your .env file');
    console.log('   3. Get the connection string from Supabase Dashboard\n');
    process.exit(1);
  }

  log(colors.blue, '📋 Connection Details:');
  
  // Parse DATABASE_URL
  let connectionUrl;
  try {
    connectionUrl = new URL(process.env.DATABASE_URL);
    console.log(`   Host: ${connectionUrl.hostname}`);
    console.log(`   Port: ${connectionUrl.port}`);
    console.log(`   Database: ${connectionUrl.pathname.slice(1)}`);
    console.log(`   User: ${connectionUrl.username}`);
    console.log(`   Password: ${'*'.repeat(connectionUrl.password.length)}`);
    console.log('');
  } catch (error) {
    log(colors.red, '❌ Invalid DATABASE_URL format');
    log(colors.yellow, '\n💡 Expected format:');
    console.log('   postgresql://USER:PASSWORD@HOST:PORT/DATABASE\n');
    process.exit(1);
  }

  // Test connection
  log(colors.blue, '🔌 Testing connection...\n');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    log(colors.green, '✅ Successfully connected to database!');
    
    // Test query
    const result = await client.query('SELECT version()');
    console.log(`   PostgreSQL Version: ${result.rows[0].version.split(' ')[1]}`);
    
    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log(`   Tables found: ${tables.rows.length}`);
    if (tables.rows.length > 0) {
      console.log('   Tables:', tables.rows.map(r => r.table_name).join(', '));
    } else {
      log(colors.yellow, '\n⚠️  No tables found. You may need to run migrations:');
      console.log('   npm run migrate\n');
    }
    
    await client.end();
    
    log(colors.green, '\n✅ Database is ready to use!\n');
    process.exit(0);
    
  } catch (error) {
    log(colors.red, '❌ Connection failed!');
    console.log(`   Error: ${error.message}\n`);
    
    log(colors.yellow, '🔧 Troubleshooting steps:\n');
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      console.log('   1. Check your internet connection');
      console.log('   2. Verify the host is correct');
      console.log('   3. Check if Supabase project is active (not paused)');
      console.log('   4. Try disabling VPN if you\'re using one\n');
    } else if (error.message.includes('password authentication failed')) {
      console.log('   1. Verify your database password is correct');
      console.log('   2. Make sure special characters are URL-encoded');
      console.log('   3. Get fresh credentials from Supabase Dashboard\n');
    } else if (error.message.includes('timeout')) {
      console.log('   1. Check your firewall settings');
      console.log('   2. Verify port 6543 (pooler) or 5432 (direct) is not blocked');
      console.log('   3. Try using direct connection instead of pooler\n');
    } else {
      console.log('   1. Check DATABASE_TROUBLESHOOTING.md for detailed help');
      console.log('   2. Verify Supabase project status');
      console.log('   3. Try regenerating database password\n');
    }
    
    log(colors.cyan, '📖 For more help, see: server/DATABASE_TROUBLESHOOTING.md\n');
    
    await client.end().catch(() => {});
    process.exit(1);
  }
}

checkConnection();
