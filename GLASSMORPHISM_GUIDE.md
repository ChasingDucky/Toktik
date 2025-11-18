# TokTik 液态玻璃设计（Glassmorphism）指南

## 🌊 概述

TokTik 平台采用现代化的**液态玻璃设计**（Glassmorphism），为用户提供优雅、流畅的视觉体验。这种设计风格以**半透明背景**、**毛玻璃模糊效果**和**柔和光影**为特色，营造出轻盈、富有层次感的界面。

## ✨ 设计特点

### 核心视觉元素

1. **背景模糊**（Backdrop Filter）
   - 使用 `backdrop-filter: blur()` 实现毛玻璃效果
   - 模糊程度：8px - 25px（根据组件类型调整）
   - 饱和度增强：`saturate(180%)`

2. **半透明背景**
   - 浅色模式：`rgba(255, 255, 255, 0.5-0.95)`
   - 深色模式：`rgba(0, 0, 0, 0.2-0.7)`
   - 自动适应当前主题

3. **边框高光**
   - 浅色模式：`rgba(255, 255, 255, 0.2-0.3)`
   - 深色模式：`rgba(255, 255, 255, 0.1-0.3)`
   - 1px 细边框

4. **柔和阴影**
   - 浅色模式：`rgba(31, 38, 135, 0.15-0.2)`
   - 深色模式：`rgba(0, 0, 0, 0.37-0.6)`
   - 阴影扩散：8-32px

5. **平滑动画**
   - 悬停效果：轻微放大或上移
   - 过渡时间：0.3s
   - 缓动函数：`cubic-bezier(0.4, 0, 0.2, 1)`

## 📦 工具库

### 文件位置

```
frontend/src/utils/glassStyles.js
```

### 核心函数

#### 1. `adaptiveGlassEffect(theme, opacity, blur)`

自适应主题的玻璃效果，根据深色/浅色模式自动调整。

**参数：**
- `theme`: MUI 主题对象
- `opacity`: 透明度对象 `{ light, dark }` (可选)
- `blur`: 模糊程度（px）(可选，默认 10)

**使用示例：**
```javascript
import { useTheme } from '@mui/material';
import { adaptiveGlassEffect } from '../utils/glassStyles';

const MyComponent = () => {
  const theme = useTheme();

  return (
    <Box sx={{
      ...adaptiveGlassEffect(theme, { light: 0.7, dark: 0.3 }, 15),
      // 其他样式...
    }}>
      内容
    </Box>
  );
};
```

#### 2. `navGlassEffect(theme)`

导航栏专用玻璃效果，具有更强的模糊和底部边框。

**特点：**
- 模糊程度：20px（强模糊）
- 透明度：浅色 0.8 / 深色 0.4
- 底部边框：1px

**使用场景：**
- TopBar（顶部导航）
- BottomNavigation（底部导航）
- 侧边栏（如有）

**示例：**
```javascript
<AppBar sx={{ ...navGlassEffect(theme) }}>
  {/* 导航内容 */}
</AppBar>
```

#### 3. `cardGlassEffect(theme)`

卡片玻璃效果，适用于内容卡片和面板。

**特点：**
- 模糊程度：12px（中等模糊）
- 透明度：浅色 0.65 / 深色 0.25
- 圆角：16px
- 悬停效果：上移 2px + 阴影加深

**使用场景：**
- 内容卡片
- 用户资料卡
- 视频信息卡
- 表单容器

**示例：**
```javascript
<Paper sx={{ ...cardGlassEffect(theme) }}>
  <CardContent>
    {/* 卡片内容 */}
  </CardContent>
</Paper>
```

#### 4. `menuGlassEffect(theme)`

菜单下拉框玻璃效果。

**特点：**
- 模糊程度：20px
- 透明度：浅色 0.95 / 深色 0.6
- 圆角：12px
- 溢出隐藏

**使用场景：**
- 用户菜单
- 下拉选择框
- 上下文菜单
- Popover 组件

**示例：**
```javascript
<Menu
  PaperProps={{
    sx: { ...menuGlassEffect(theme) }
  }}
>
  <MenuItem>选项 1</MenuItem>
  <MenuItem>选项 2</MenuItem>
</Menu>
```

#### 5. `inputGlassEffect(theme)`

输入框玻璃效果。

**特点：**
- 模糊程度：8px（轻度模糊）
- 透明度：浅色 0.5 / 深色 0.2
- 圆角：12px
- 边框渐变效果

**使用场景：**
- 搜索框
- 文本输入框
- 文本域

**示例：**
```javascript
<TextField
  sx={{
    ...inputGlassEffect(theme),
    // 其他样式...
  }}
/>
```

#### 6. `videoControlGlassEffect(theme)`

视频控制栏玻璃效果（固定深色）。

**特点：**
- 模糊程度：12px
- 背景：`rgba(0, 0, 0, 0.4)`
- 顶部边框：`rgba(255, 255, 255, 0.1)`

**使用场景：**
- 视频进度条
- 视频信息叠加层
- 视频控制按钮区域

**示例：**
```javascript
<Box sx={{
  position: 'absolute',
  bottom: 0,
  ...videoControlGlassEffect(theme),
}}>
  {/* 视频控制 */}
</Box>
```

#### 7. `buttonGlassEffect(theme)`

按钮玻璃效果。

**特点：**
- 模糊程度：10px
- 悬停效果：缩放 1.02
- 点击效果：缩放 0.98
- 圆角：12px

**使用场景：**
- 主要操作按钮
- 次要按钮
- 图标按钮

#### 8. `modalGlassEffect(theme)`

模态框玻璃效果。

**特点：**
- 模糊程度：25px（最强模糊）
- 透明度：浅色 0.9 / 深色 0.5
- 圆角：24px

**使用场景：**
- 对话框
- 模态窗口
- 全屏弹窗

#### 9. `gradientGlassEffect(theme, colors)`

渐变玻璃效果（彩色）。

**参数：**
- `colors`: 颜色数组，默认 `['#fe2c55', '#00f2ea']`

**特点：**
- 渐变背景 + 玻璃效果
- 饱和度：200%
- 适合特殊强调区域

## 🎨 已应用的组件

### ✅ TopBar（顶部导航栏）

**应用区域：**
- 整体导航栏：`navGlassEffect`
- 搜索框：`inputGlassEffect`
- 用户菜单：`menuGlassEffect`

**效果：**
```javascript
// AppBar
<AppBar sx={{ ...navGlassEffect(muiTheme) }}>

// 搜索框
<Box sx={{ ...inputGlassEffect(muiTheme), borderRadius: 20 }}>

// 用户菜单
<Menu PaperProps={{ sx: { ...menuGlassEffect(muiTheme) } }}>
```

### ✅ BottomNavigation（底部导航）

**应用区域：**
- 整体底部导航：`navGlassEffect`

**效果：**
```javascript
<Paper sx={{
  ...navGlassEffect(theme),
  borderTop: `1px solid ${borderColor}`,
}}>
```

### ✅ Login（登录页面）

**应用区域：**
- 登录卡片：`cardGlassEffect`

**效果：**
```javascript
<Paper sx={{
  ...cardGlassEffect(theme),
  borderRadius: '24px',
}}>
```

### ✅ VideoPlayer（视频播放器）

**应用区域：**
- 时间显示栏：`videoControlGlassEffect`
- 底部信息栏：`videoControlGlassEffect`

**效果：**
```javascript
// 时间和进度条容器
<Box sx={{ ...videoControlGlassEffect() }}>

// 视频信息叠加
<Box sx={{ ...videoControlGlassEffect() }}>
```

## 📋 待应用的组件

### 高优先级

- [ ] **Register** - 注册页面（使用 `cardGlassEffect`）
- [ ] **Upload** - 上传页面（表单使用 `cardGlassEffect`）
- [ ] **Profile** - 用户主页（卡片使用 `cardGlassEffect`）
- [ ] **ProfileEdit** - 资料编辑（表单使用 `cardGlassEffect`）

### 中优先级

- [ ] **Discover** - 发现页面（视频卡片使用 `cardGlassEffect`）
- [ ] **Search** - 搜索页面（结果卡片使用 `cardGlassEffect`）
- [ ] **Favorites** - 收藏页面（视频卡片使用 `cardGlassEffect`）
- [ ] **NotificationMenu** - 通知菜单（使用 `menuGlassEffect`）
- [ ] **LanguageSwitcher** - 语言切换（菜单使用 `menuGlassEffect`）

### 低优先级

- [ ] **About** - 关于页面（卡片使用 `cardGlassEffect`）
- [ ] **Snackbar** - Toast 通知（使用 `snackbarGlassEffect`）
- [ ] **Dialog** - 对话框（使用 `modalGlassEffect`）

## 🔧 如何使用

### 步骤 1：导入必要的依赖

```javascript
import { useTheme } from '@mui/material';
import { cardGlassEffect } from '../utils/glassStyles';
```

### 步骤 2：获取主题对象

```javascript
const MyComponent = () => {
  const theme = useTheme();
  // ...
};
```

### 步骤 3：应用玻璃效果

```javascript
<Box sx={{
  ...cardGlassEffect(theme),
  // 可以覆盖或添加其他样式
  padding: 3,
  margin: 2,
}}>
  内容
</Box>
```

## 🎯 最佳实践

### 1. 选择合适的模糊程度

- **导航栏**：20px（需要清晰区分层级）
- **卡片**：12px（平衡可读性和美观）
- **输入框**：8px（保持输入内容清晰）
- **模态框**：25px（强调前景内容）

### 2. 透明度设置建议

- **浅色模式**：0.5 - 0.95（保持足够对比度）
- **深色模式**：0.2 - 0.7（避免过亮）

### 3. 避免过度使用

- 不要在同一视图中使用过多玻璃效果
- 保留部分纯色元素作为对比
- 确保文本可读性

### 4. 性能考虑

- `backdrop-filter` 可能影响性能
- 避免在滚动容器中大量使用
- 移动端谨慎使用（部分浏览器支持不完善）

### 5. 浏览器兼容性

```css
/* 总是同时使用两个前缀 */
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
```

工具库已自动处理 Safari 兼容性（WebkitBackdropFilter）。

## 🌈 自定义玻璃效果

如果预设效果不满足需求，可以自定义：

```javascript
const customGlassEffect = (theme) => ({
  background: theme.palette.mode === 'dark'
    ? 'rgba(50, 50, 50, 0.4)'
    : 'rgba(240, 240, 240, 0.6)',
  backdropFilter: 'blur(15px) saturate(200%)',
  WebkitBackdropFilter: 'blur(15px) saturate(200%)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  borderRadius: '16px',
});
```

## 📊 效果对比

| 组件类型 | 模糊程度 | 浅色透明度 | 深色透明度 | 圆角 |
|---------|---------|-----------|-----------|------|
| 导航栏 | 20px | 0.8 | 0.4 | 0 |
| 卡片 | 12px | 0.65 | 0.25 | 16px |
| 菜单 | 20px | 0.95 | 0.6 | 12px |
| 输入框 | 8px | 0.5 | 0.2 | 12px |
| 按钮 | 10px | 0.6 | 0.3 | 12px |
| 模态框 | 25px | 0.9 | 0.5 | 24px |
| 视频控制 | 12px | - | 0.4 | 0 |

## 🚀 未来改进

1. **性能优化**
   - 使用 CSS 变量减少计算开销
   - 添加降级方案（不支持 backdrop-filter 的浏览器）

2. **更多预设**
   - 侧边栏玻璃效果
   - 表格玻璃效果
   - 标签页玻璃效果

3. **可配置性**
   - 全局玻璃效果配置
   - 用户自定义透明度和模糊程度

4. **主题集成**
   - 在 ThemeContext 中集成玻璃效果配置
   - 支持多种玻璃效果主题

## 💡 设计灵感

液态玻璃设计灵感来源于：
- Apple iOS/macOS 的 translucent effects
- Windows 11 的 Mica 材质
- Material Design 3 的 Surface Tint
- Fluent Design 的 Acrylic 材质

## 📚 相关资源

- [Glassmorphism CSS Generator](https://css.glass/)
- [MDN: backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [Can I Use: backdrop-filter](https://caniuse.com/css-backdrop-filter)

---

**当前版本**: v1.0.0
**最后更新**: 2025-11-18
