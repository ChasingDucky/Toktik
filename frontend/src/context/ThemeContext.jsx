import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  generateThemeFromColor,
  getDefaultTheme,
  extractColorFromImage,
  applyThemeColors
} from '../utils/colorExtractor';
import { argbFromRgb } from '@material/material-color-utilities';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark'); // TikTok默认深色模式
  const [sourceColor, setSourceColor] = useState(null);
  const [themeColors, setThemeColors] = useState(() => getDefaultTheme(true));

  // 切换深色/浅色模式
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // 从图片提取颜色并更新主题
  const updateThemeFromImage = async (imageUrl) => {
    try {
      const color = await extractColorFromImage(imageUrl);
      setSourceColor(color);
      const newTheme = generateThemeFromColor(color, mode === 'dark');
      setThemeColors(newTheme);
      applyThemeColors(newTheme);
    } catch (error) {
      console.error('Failed to extract color from image:', error);
    }
  };

  // 从颜色值更新主题
  const updateThemeFromColor = (r, g, b) => {
    const color = argbFromRgb(r, g, b);
    setSourceColor(color);
    const newTheme = generateThemeFromColor(color, mode === 'dark');
    setThemeColors(newTheme);
    applyThemeColors(newTheme);
  };

  // 重置为默认主题
  const resetTheme = () => {
    setSourceColor(null);
    const defaultTheme = getDefaultTheme(mode === 'dark');
    setThemeColors(defaultTheme);
    applyThemeColors(defaultTheme);
  };

  // 当模式改变时更新主题
  useEffect(() => {
    const newTheme = sourceColor
      ? generateThemeFromColor(sourceColor, mode === 'dark')
      : getDefaultTheme(mode === 'dark');
    setThemeColors(newTheme);
    applyThemeColors(newTheme);
  }, [mode, sourceColor]);

  // 创建MUI主题
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: themeColors.primary,
            contrastText: themeColors.onPrimary,
          },
          secondary: {
            main: themeColors.secondary,
            contrastText: themeColors.onSecondary,
          },
          error: {
            main: themeColors.error,
            contrastText: themeColors.onError,
          },
          background: {
            default: themeColors.background,
            paper: themeColors.surface,
          },
          text: {
            primary: themeColors.onBackground,
            secondary: themeColors.onSurfaceVariant,
          },
        },
        shape: {
          borderRadius: 28, // Material 3 圆角
        },
        typography: {
          fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 20,
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
          MuiFab: {
            styleOverrides: {
              root: {
                borderRadius: 16,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode, themeColors]
  );

  const value = {
    mode,
    toggleMode,
    themeColors,
    updateThemeFromImage,
    updateThemeFromColor,
    resetTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
