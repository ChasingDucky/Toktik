#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const { seedDatabase } = require('./utils/seedData');

async function main() {
  try {
    console.log('连接数据库...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/toktik', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✓ 数据库连接成功\n');

    await seedDatabase();

    await mongoose.connection.close();
    console.log('\n数据库连接已关闭');
    process.exit(0);
  } catch (error) {
    console.error('错误:', error);
    process.exit(1);
  }
}

main();
