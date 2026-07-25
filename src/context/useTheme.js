import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { dark: true, isDark: true, toggleTheme: () => {} };
  }
  return context;
}
