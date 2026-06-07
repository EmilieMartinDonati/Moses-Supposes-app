/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

const mainBlue = '#6f8fa3';
const mainBeige = '#f1e9df';
const elevatedBeige = '#eadfce';
const chocolate = '#3e2723';
const honey = '#e6b566';
const paleRose = '#e8a3a3';
const waterGreen = '#a8d5c3';
const forestGreen = '#356a5a'
const mediumGreen = '#4f8f7a'
const faintWarmWhite = "#faf7f4"
const redError = "#b33a3a"

export const Colors = {
  light: {
    background: mainBeige,
    mainBlue: mainBlue,
    chocolate: chocolate,
    honey: honey,
    paleRose: paleRose,
    waterGreen: waterGreen,
    mediumGreen: mediumGreen,
    forestGreen: forestGreen,
    faintWarmWhite: faintWarmWhite,
    mainBeige: mainBeige,
    elevatedBeige: elevatedBeige,
    redError: redError,
    text: '#11181C',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
