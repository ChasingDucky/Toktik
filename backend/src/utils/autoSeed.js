const { seedDatabase } = require('./seedData');
const Video = require('../models/Video');

/**
 * 自动检查并初始化数据
 * 如果数据库为空，自动添加测试数据
 */
async function autoSeed() {
  try {
    const videoCount = await Video.countDocuments();

    if (videoCount === 0) {
      console.log('\n========================================');
      console.log('检测到数据库为空，正在初始化测试数据...');
      console.log('========================================\n');

      await seedDatabase();

      console.log('\n✅ 测试数据已自动初始化！');
      console.log('现在可以访问应用并浏览视频了。\n');
    } else {
      console.log(`数据库已有 ${videoCount} 个视频，跳过自动初始化。`);
    }
  } catch (error) {
    console.error('自动初始化数据失败:', error);
    // 不阻止应用启动
  }
}

module.exports = { autoSeed };
