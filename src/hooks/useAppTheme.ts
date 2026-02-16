import { useTheme } from 'react-native-paper';
import { AppDarkTheme } from '../theme';

// Custom theme type that includes our extended color tokens
export type AppTheme = typeof AppDarkTheme;

/**
 * Typed `useTheme` hook that returns our app-specific theme
 * with custom color tokens (accent, tabBar*, income/expenseIcon, etc.)
 */
export const useAppTheme = () => useTheme<AppTheme>();
