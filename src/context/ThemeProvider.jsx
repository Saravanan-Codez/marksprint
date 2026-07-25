import React, { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

const themeNames = ['space', 'neon'];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('space');

  useEffect(() => {
    themeNames.forEach((name) => document.body.classList.remove(`theme-${name}`));
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'space' ? 'neon' : 'space'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'space', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}


