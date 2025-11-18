# TokTik 国际化（i18n）使用指南

## 📖 概述

TokTik 平台已集成 `i18next` 和 `react-i18next`，支持多语言国际化。目前支持**中文（zh）**和**英文（en）**两种语言。

## 🌍 已支持的语言

- **中文（简体）** - `zh` 🇨🇳
- **English** - `en` 🇺🇸

## 🏗️ 架构设计

### 文件结构

```
frontend/src/
├── i18n.js                      # i18n 配置文件
├── locales/                     # 翻译资源目录
│   ├── zh.json                  # 中文翻译
│   └── en.json                  # 英文翻译
└── components/
    └── LanguageSwitcher.jsx     # 语言切换组件
```

### i18n 配置 (`i18n.js`)

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)         // 自动检测用户语言
  .use(initReactI18next)         // 集成 React
  .init({
    resources,                    // 翻译资源
    fallbackLng: 'zh',            // 默认语言：中文
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],   // 缓存用户选择
    },
  });
```

## 🎯 如何使用

### 1. 在函数组件中使用

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('app.name')}</h1>
      <p>{t('app.slogan')}</p>
      <button>{t('common.submit')}</button>
    </div>
  );
};
```

### 2. 在类组件中使用

```javascript
import { withTranslation } from 'react-i18next';

class MyComponent extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <div>
        <h1>{t('app.name')}</h1>
      </div>
    );
  }
}

export default withTranslation()(MyComponent);
```

### 3. 访问嵌套翻译

翻译资源支持嵌套结构：

```json
{
  "auth": {
    "login": "登录",
    "logout": "退出登录"
  }
}
```

使用点符号访问：

```javascript
{t('auth.login')}      // "登录"
{t('auth.logout')}     // "退出登录"
```

### 4. 语言切换

使用 `LanguageSwitcher` 组件：

```javascript
import LanguageSwitcher from './components/LanguageSwitcher';

<LanguageSwitcher />
```

或者通过代码切换：

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage('zh')}>中文</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
};
```

## 📝 翻译资源结构

### 主要分类

翻译资源按功能模块组织：

```json
{
  "app": {              // 应用基本信息
    "name": "TokTik",
    "slogan": "分享精彩瞬间"
  },
  "nav": {              // 导航相关
    "home": "首页",
    "discover": "发现"
  },
  "auth": {             // 认证相关
    "login": "登录",
    "register": "注册"
  },
  "video": {            // 视频相关
    "upload": "上传",
    "like": "点赞"
  },
  "profile": {          // 用户资料
    "editProfile": "编辑资料"
  },
  "notification": {     // 通知
    "title": "通知"
  },
  "common": {           // 通用文本
    "loading": "加载中...",
    "success": "成功"
  },
  "message": {          // 提示消息
    "loginSuccess": "登录成功"
  },
  "error": {            // 错误信息
    "title": "哎呀，出错了！"
  }
}
```

## 🔧 如何添加新翻译

### 步骤 1: 更新翻译文件

在 `frontend/src/locales/zh.json` 添加中文翻译：

```json
{
  "newFeature": {
    "title": "新功能",
    "description": "这是一个新功能"
  }
}
```

在 `frontend/src/locales/en.json` 添加英文翻译：

```json
{
  "newFeature": {
    "title": "New Feature",
    "description": "This is a new feature"
  }
}
```

### 步骤 2: 在组件中使用

```javascript
const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t('newFeature.title')}</h2>
      <p>{t('newFeature.description')}</p>
    </div>
  );
};
```

## ✅ 已完成国际化的组件

目前已更新以下核心组件：

- ✅ **TopBar** - 顶部导航栏
  - 搜索框占位符
  - 用户菜单（我的主页、上传视频、关于、退出登录）
  - 登录按钮

- ✅ **BottomNavigation** - 底部导航栏
  - 所有导航标签（首页、发现、上传、收藏、我的）

- ✅ **ErrorBoundary** - 错误边界
  - 错误标题和消息
  - 重试和刷新按钮
  - 支持提示

- ✅ **Login** - 登录页面
  - 所有表单标签和按钮
  - 提示文本

- ✅ **LanguageSwitcher** - 语言切换器
  - 支持中英文切换，带国旗图标

## 📋 待完成的组件

以下组件需要更新以支持国际化：

### 高优先级
- [ ] **Register** - 注册页面
- [ ] **Upload** - 视频上传页面
- [ ] **Profile** - 用户主页
- [ ] **ProfileEdit** - 资料编辑页面
- [ ] **VideoPlayer** - 视频播放器

### 中优先级
- [ ] **Home** - 首页
- [ ] **Discover** - 发现页面
- [ ] **Search** - 搜索页面
- [ ] **Favorites** - 收藏页面
- [ ] **NotificationMenu** - 通知菜单

### 低优先级
- [ ] **About** - 关于页面
- [ ] **SnackbarContext** - Toast 通知

## 🎨 最佳实践

### 1. 使用语义化的键名

✅ 好的命名：
```json
{
  "auth.login": "登录",
  "video.uploadSuccess": "上传成功"
}
```

❌ 避免的命名：
```json
{
  "button1": "登录",
  "msg1": "上传成功"
}
```

### 2. 避免硬编码文本

❌ 不好的做法：
```javascript
<Button>登录</Button>
```

✅ 好的做法：
```javascript
<Button>{t('auth.login')}</Button>
```

### 3. 保持翻译键的一致性

确保 `zh.json` 和 `en.json` 有相同的键结构：

```json
// zh.json
{
  "video": {
    "title": "标题",
    "description": "描述"
  }
}

// en.json
{
  "video": {
    "title": "Title",
    "description": "Description"
  }
}
```

### 4. 使用占位符处理动态内容

```json
{
  "greeting": "你好，{{name}}！"
}
```

使用方式：
```javascript
{t('greeting', { name: user.username })}
```

## 🧪 测试国际化

### 1. 手动测试

1. 启动应用
2. 点击顶部导航栏的语言切换按钮（地球图标🌍）
3. 选择不同语言
4. 验证页面文本是否正确切换

### 2. 检查翻译完整性

确保所有翻译键在两种语言中都存在：

```bash
# 可以使用工具对比 zh.json 和 en.json 的键
```

## 🔍 调试技巧

### 启用调试模式

在 `i18n.js` 中设置：

```javascript
i18n.init({
  debug: true,  // 在控制台显示 i18n 日志
  // ...其他配置
});
```

### 检查当前语言

```javascript
const { i18n } = useTranslation();
console.log('Current language:', i18n.language);
```

### 检查翻译键是否存在

```javascript
const { t, i18n } = useTranslation();

// 检查键是否存在
if (i18n.exists('some.key')) {
  console.log(t('some.key'));
}
```

## 📚 相关资源

- [react-i18next 官方文档](https://react.i18next.com/)
- [i18next 官方文档](https://www.i18next.com/)
- [i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languageDetector)

## 🌟 下一步计划

1. 完成所有页面组件的国际化
2. 添加更多语言支持（如日语、韩语）
3. 实现日期和数字的本地化格式
4. 添加 RTL（从右到左）语言支持
5. 实现翻译管理后台

## 💡 贡献指南

如果你想添加新的语言支持：

1. 在 `frontend/src/locales/` 创建新的语言文件，如 `ja.json`
2. 复制 `en.json` 的结构
3. 翻译所有文本
4. 在 `i18n.js` 中导入并添加到资源中
5. 在 `LanguageSwitcher.jsx` 中添加语言选项

---

**当前版本**: v1.0.0
**最后更新**: 2025-11-18
