/**
 * Material You Color Extraction and Theming
 * 使用莫奈取色系统从图片中提取主题色
 */
import {
  argbFromRgb,
  themeFromSourceColor,
  applyTheme,
  hexFromArgb,
  Hct
} from '@material/material-color-utilities';

/**
 * 从图片URL提取主色调
 * @param {string} imageUrl - 图片URL
 * @returns {Promise<number>} ARGB格式的颜色值
 */
export async function extractColorFromImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 缩小图片以提高性能
      const scaleFactor = 0.1;
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // 颜色频率映射
      const colorMap = new Map();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // 跳过透明像素
        if (a < 128) continue;

        const argb = argbFromRgb(r, g, b);
        colorMap.set(argb, (colorMap.get(argb) || 0) + 1);
      }

      // 找到最常见的颜色
      let dominantColor = 0xff6200ee; // 默认紫色
      let maxCount = 0;

      for (const [color, count] of colorMap.entries()) {
        if (count > maxCount) {
          maxCount = count;
          dominantColor = color;
        }
      }

      resolve(dominantColor);
    };

    img.onerror = () => {
      // 如果加载失败，返回默认颜色
      resolve(0xff6200ee);
    };

    img.src = imageUrl;
  });
}

/**
 * 从颜色值生成Material You主题
 * @param {number} sourceColor - ARGB格式的源颜色
 * @param {boolean} isDark - 是否为深色模式
 * @returns {object} 主题对象
 */
export function generateThemeFromColor(sourceColor, isDark = false) {
  const theme = themeFromSourceColor(sourceColor);

  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;

  return {
    primary: hexFromArgb(scheme.primary),
    onPrimary: hexFromArgb(scheme.onPrimary),
    primaryContainer: hexFromArgb(scheme.primaryContainer),
    onPrimaryContainer: hexFromArgb(scheme.onPrimaryContainer),

    secondary: hexFromArgb(scheme.secondary),
    onSecondary: hexFromArgb(scheme.onSecondary),
    secondaryContainer: hexFromArgb(scheme.secondaryContainer),
    onSecondaryContainer: hexFromArgb(scheme.onSecondaryContainer),

    tertiary: hexFromArgb(scheme.tertiary),
    onTertiary: hexFromArgb(scheme.onTertiary),
    tertiaryContainer: hexFromArgb(scheme.tertiaryContainer),
    onTertiaryContainer: hexFromArgb(scheme.onTertiaryContainer),

    error: hexFromArgb(scheme.error),
    onError: hexFromArgb(scheme.onError),
    errorContainer: hexFromArgb(scheme.errorContainer),
    onErrorContainer: hexFromArgb(scheme.onErrorContainer),

    background: hexFromArgb(scheme.background),
    onBackground: hexFromArgb(scheme.onBackground),

    surface: hexFromArgb(scheme.surface),
    onSurface: hexFromArgb(scheme.onSurface),
    surfaceVariant: hexFromArgb(scheme.surfaceVariant),
    onSurfaceVariant: hexFromArgb(scheme.onSurfaceVariant),

    outline: hexFromArgb(scheme.outline),
    outlineVariant: hexFromArgb(scheme.outlineVariant),

    shadow: hexFromArgb(scheme.shadow),
    scrim: hexFromArgb(scheme.scrim),

    inverseSurface: hexFromArgb(scheme.inverseSurface),
    inverseOnSurface: hexFromArgb(scheme.inverseOnSurface),
    inversePrimary: hexFromArgb(scheme.inversePrimary),
  };
}

/**
 * 应用主题色到DOM
 * @param {object} themeColors - 主题颜色对象
 */
export function applyThemeColors(themeColors) {
  const root = document.documentElement;

  Object.entries(themeColors).forEach(([key, value]) => {
    const cssVarName = `--md-sys-color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });
}

/**
 * 生成默认主题
 * @param {boolean} isDark - 是否为深色模式
 * @returns {object} 主题对象
 */
export function getDefaultTheme(isDark = false) {
  // TikTok风格的默认颜色 - 使用青色/粉色
  const defaultColor = argbFromRgb(0, 242, 234); // TikTok青色
  return generateThemeFromColor(defaultColor, isDark);
}
