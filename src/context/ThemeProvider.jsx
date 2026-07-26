import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

const themeNames = ['space', 'bright'];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('marksprint_theme_mode') || 'space';
    } catch {
      return 'space';
    }
  });

  useEffect(() => {
    themeNames.forEach((name) => {
      document.body.classList.remove(`theme-${name}`);
      document.documentElement.classList.remove(`theme-${name}`);
    });
    document.body.classList.add(`theme-${theme}`);
    document.documentElement.classList.add(`theme-${theme}`);
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('marksprint_theme_mode', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'space' ? 'bright' : 'space'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'space', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
