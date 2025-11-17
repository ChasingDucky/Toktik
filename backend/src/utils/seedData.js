const mongoose = require('mongoose');
const User = require('../models/User');
const Video = require('../models/Video');
const Comment = require('../models/Comment');

const sampleUsers = [
  {
    username: 'demo_user',
    email: 'demo@toktik.com',
    password: '123456',
    bio: '这是一个演示账号 🎬',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    username: 'travel_lover',
    email: 'travel@toktik.com',
    password: '123456',
    bio: '热爱旅行的视频创作者 ✈️',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    username: 'food_expert',
    email: 'food@toktik.com',
    password: '123456',
    bio: '美食探索家 🍜',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    username: 'tech_guru',
    email: 'tech@toktik.com',
    password: '123456',
    bio: '科技数码博主 💻',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    username: 'music_fan',
    email: 'music@toktik.com',
    password: '123456',
    bio: '音乐爱好者 🎵',
    avatar: 'https://i.pravatar.cc/150?img=5'
  }
];

// 示例视频 - 使用公开的测试视频URL
const sampleVideos = [
  {
    title: '欢迎来到TokTik！',
    description: '这是一个演示视频。上传你的第一个视频，开始分享精彩瞬间吧！',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    tags: ['欢迎', '演示', '开始'],
    musicName: 'Welcome Music'
  },
  {
    title: '美好的一天',
    description: '分享生活中的美好瞬间 ☀️',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    tags: ['生活', '日常', '美好'],
    musicName: 'Happy Day'
  },
  {
    title: '探索世界',
    description: '去看看这个美丽的世界 🌍',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    tags: ['旅行', '探索', '世界'],
    musicName: 'Adventure Time'
  },
  {
    title: '美食时刻',
    description: '分享今天的美食 🍕',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    tags: ['美食', '料理', '分享'],
    musicName: 'Cooking Beat'
  },
  {
    title: '科技前沿',
    description: '最新科技资讯分享 📱',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    tags: ['科技', '数码', '前沿'],
    musicName: 'Tech Sound'
  },
  {
    title: '音乐时光',
    description: '享受音乐带来的快乐 🎸',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    tags: ['音乐', '分享', '快乐'],
    musicName: 'Music Vibes'
  },
  {
    title: '运动健康',
    description: '每天运动30分钟 💪',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    tags: ['运动', '健康', '健身'],
    musicName: 'Workout Mix'
  },
  {
    title: '学习时间',
    description: '今天学到的新知识 📚',
    videoUrl: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
    tags: ['学习', '知识', '成长'],
    musicName: 'Study Time'
  }
];

const sampleComments = [
  '太棒了！👍',
  '很喜欢这个视频',
  '继续加油！',
  '学到了新东西',
  '非常有用的内容',
  '期待更多作品',
  '超赞！',
  '感谢分享',
  '很有创意',
  '支持你！'
];

async function seedDatabase() {
  try {
    console.log('开始初始化数据库...');

    // 清空现有数据（可选）
    const userCount = await User.countDocuments();
    const videoCount = await Video.countDocuments();

    if (userCount > 0 || videoCount > 0) {
      console.log(`数据库已有数据: ${userCount} 个用户, ${videoCount} 个视频`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      return new Promise((resolve) => {
        readline.question('是否清空现有数据？(yes/no): ', async (answer) => {
          readline.close();
          if (answer.toLowerCase() === 'yes') {
            await User.deleteMany({});
            await Video.deleteMany({});
            await Comment.deleteMany({});
            console.log('已清空现有数据');
            await createData();
            resolve();
          } else {
            console.log('保留现有数据，仅添加新数据');
            await createData();
            resolve();
          }
        });
      });
    } else {
      await createData();
    }
  } catch (error) {
    console.error('初始化数据失败:', error);
    process.exit(1);
  }
}

async function createData() {
  try {
    // 1. 创建用户
    console.log('创建用户...');
    const users = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      users.push(user);
      console.log(`✓ 创建用户: ${user.username}`);
    }

    // 2. 创建视频
    console.log('\n创建视频...');
    const videos = [];
    for (let i = 0; i < sampleVideos.length; i++) {
      const videoData = sampleVideos[i];
      const user = users[i % users.length];

      const video = await Video.create({
        ...videoData,
        user: user._id,
        duration: 10,
        views: Math.floor(Math.random() * 10000),
        isPublic: true
      });

      videos.push(video);
      console.log(`✓ 创建视频: ${video.title} (作者: ${user.username})`);
    }

    // 3. 创建评论
    console.log('\n创建评论...');
    for (const video of videos) {
      const numComments = Math.floor(Math.random() * 5) + 2;

      for (let i = 0; i < numComments; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomComment = sampleComments[Math.floor(Math.random() * sampleComments.length)];

        const comment = await Comment.create({
          text: randomComment,
          user: randomUser._id,
          video: video._id
        });

        video.comments.push(comment._id);
      }

      await video.save();
    }
    console.log(`✓ 创建了评论`);

    // 4. 添加点赞
    console.log('\n添加点赞...');
    for (const video of videos) {
      const numLikes = Math.floor(Math.random() * users.length);
      const likedUsers = users.slice(0, numLikes);

      video.likes = likedUsers.map(u => u._id);
      await video.save();

      for (const user of likedUsers) {
        user.likedVideos.push(video._id);
        await user.save();
      }
    }
    console.log(`✓ 添加了点赞`);

    // 5. 添加关注关系
    console.log('\n添加关注关系...');
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const followCount = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < followCount; j++) {
        const randomIndex = (i + j + 1) % users.length;
        const userToFollow = users[randomIndex];

        if (!user.following.includes(userToFollow._id)) {
          user.following.push(userToFollow._id);
          userToFollow.followers.push(user._id);

          await user.save();
          await userToFollow.save();
        }
      }
    }
    console.log(`✓ 添加了关注关系`);

    console.log('\n✅ 数据初始化完成！');
    console.log('\n统计信息:');
    console.log(`- 用户数: ${users.length}`);
    console.log(`- 视频数: ${videos.length}`);
    console.log(`- 评论数: ${await Comment.countDocuments()}`);
    console.log('\n登录信息:');
    console.log('- 邮箱: demo@toktik.com');
    console.log('- 密码: 123456');
    console.log('\n可以使用以上账号登录测试！');

  } catch (error) {
    console.error('创建数据失败:', error);
    throw error;
  }
}

module.exports = { seedDatabase };
