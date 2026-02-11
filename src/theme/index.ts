import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const customColors = {
    primary: '#006D77', // Teal-ish
    secondary: '#83C5BE',
    tertiary: '#E29578',
    error: '#BA1A1A',
    income: '#2E7D32',
    expense: '#C62828',
    white: '#FFFFFF',
    text: '#121212',
};

export const AppLightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: customColors.primary,
        secondary: customColors.secondary,
        tertiary: customColors.tertiary,
        error: customColors.error,
        customIncome: customColors.income,
        customExpense: customColors.expense,
    },
};

export const AppDarkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#00E676', // Neon Green
        onPrimary: '#000000',
        secondary: '#651FFF', // Deep Purple
        tertiary: '#2979FF', // Blue Accent
        background: '#0A0E17', // Deep Dark Blue/Black
        surface: '#111625', // Slightly lighter dark
        surfaceVariant: '#1F293A',
        error: '#CF6679',
        onSurface: '#FFFFFF',
        onSurfaceVariant: '#B0BEC5',
        customIncome: '#00E676', // Matching Primary
        customExpense: '#FF1744', // Bright Red
        elevation: {
            level0: 'transparent',
            level1: '#111625',
            level2: '#1F293A',
            level3: '#2C3A50',
            level4: '#394B66',
            level5: '#455C7C',
        }
    },
};
