import React, { useState } from 'react';
import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true); // Default to true

  const toggleTheme = () => {
    setDark(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ dark, isDark: dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}


