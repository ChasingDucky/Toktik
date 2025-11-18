/**
 * Glassmorphism (液态玻璃) 设计样式工具
 * 提供一致的毛玻璃效果样式
 */

/**
 * 基础玻璃效果样式
 * @param {string} opacity - 背景透明度 (0-1)
 * @param {number} blur - 模糊程度 (px)
 * @param {string} borderOpacity - 边框透明度 (0-1)
 */
export const glassEffect = (opacity = 0.7, blur = 10, borderOpacity = 0.2) => ({
  background: `rgba(255, 255, 255, ${opacity})`,
  backdropFilter: `blur(${blur}px) saturate(180%)`,
  WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`, // Safari support
  border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
});

/**
 * 深色模式玻璃效果
 */
export const glassEffectDark = (opacity = 0.3, blur = 10, borderOpacity = 0.3) => ({
  background: `rgba(0, 0, 0, ${opacity})`,
  backdropFilter: `blur(${blur}px) saturate(180%)`,
  WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
  border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
});

/**
 * 自适应主题的玻璃效果（根据 MUI 主题模式）
 */
export const adaptiveGlassEffect = (theme, opacity = { light: 0.7, dark: 0.3 }, blur = 10) => {
  const isDark = theme.palette.mode === 'dark';

  return {
    background: isDark
      ? `rgba(0, 0, 0, ${opacity.dark})`
      : `rgba(255, 255, 255, ${opacity.light})`,
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.3)'}`,
    boxShadow: isDark
      ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
      : '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  };
};

/**
 * 导航栏玻璃效果（更强的模糊）
 */
export const navGlassEffect = (theme) => ({
  ...adaptiveGlassEffect(theme, { light: 0.8, dark: 0.4 }, 20),
  borderBottom: `1px solid ${
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.1)'
      : 'rgba(0, 0, 0, 0.1)'
  }`,
});

/**
 * 卡片玻璃效果（适度模糊）
 */
export const cardGlassEffect = (theme) => ({
  ...adaptiveGlassEffect(theme, { light: 0.65, dark: 0.25 }, 12),
  borderRadius: '16px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px 0 rgba(0, 0, 0, 0.6)'
      : '0 12px 40px 0 rgba(31, 38, 135, 0.2)',
  },
});

/**
 * 模态框/对话框玻璃效果
 */
export const modalGlassEffect = (theme) => ({
  ...adaptiveGlassEffect(theme, { light: 0.9, dark: 0.5 }, 25),
  borderRadius: '24px',
});

/**
 * 输入框玻璃效果
 */
export const inputGlassEffect = (theme) => ({
  ...adaptiveGlassEffect(theme, { light: 0.5, dark: 0.2 }, 8),
  borderRadius: '12px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(0, 0, 0, 0.15)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.3)'
      : 'rgba(0, 0, 0, 0.25)',
  },
});

/**
 * 按钮玻璃效果
 */
export const buttonGlassEffect = (theme) => ({
  ...adaptiveGlassEffect(theme, { light: 0.6, dark: 0.3 }, 10),
  borderRadius: '12px',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(255, 255, 255, 0.9)',
    transform: 'scale(1.02)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
});

/**
 * 浮动操作按钮玻璃效果
 */
export const fabGlassEffect = (theme) => ({
  ...adaptiveGlassEffect(theme, { light: 0.7, dark: 0.4 }, 15),
  borderRadius: '50%',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.2)'
      : 'rgba(255, 255, 255, 0.95)',
    transform: 'scale(1.1)',
  },
});

/**
 * 渐变玻璃效果（彩色）
 */
export const gradientGlassEffect = (theme, colors = ['#fe2c55', '#00f2ea']) => ({
  background: `linear-gradient(135deg, ${colors[0]}33, ${colors[1]}33)`,
  backdropFilter: 'blur(15px) saturate(200%)',
  WebkitBackdropFilter: 'blur(15px) saturate(200%)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
    : '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  borderRadius: '16px',
});

/**
 * 菜单/下拉框玻璃效果
 */
export const menuGlassEffect = (theme) => ({
  ...adaptiveGlassEffect(theme, { light: 0.95, dark: 0.6 }, 20),
  borderRadius: '12px',
  overflow: 'hidden',
});

/**
 * 视频控制栏玻璃效果
 */
export const videoControlGlassEffect = (theme) => ({
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(12px) saturate(150%)',
  WebkitBackdropFilter: 'blur(12px) saturate(150%)',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
});

/**
 * Snackbar/Toast 玻璃效果
 */
export const snackbarGlassEffect = (theme) => ({
  ...adaptiveGlassEffect(theme, { light: 0.95, dark: 0.7 }, 15),
  borderRadius: '12px',
});

export default {
  glassEffect,
  glassEffectDark,
  adaptiveGlassEffect,
  navGlassEffect,
  cardGlassEffect,
  modalGlassEffect,
  inputGlassEffect,
  buttonGlassEffect,
  fabGlassEffect,
  gradientGlassEffect,
  menuGlassEffect,
  videoControlGlassEffect,
  snackbarGlassEffect,
};
