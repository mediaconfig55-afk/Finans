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
        primary: '#4DB6AC',
        secondary: '#B2DFDB',
        tertiary: '#FFCCBC',
        error: '#CF6679',
        customIncome: '#81C784',
        customExpense: '#E57373',
    },
};
