import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'quickutility-theme';

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

      root.classList.toggle('dark', resolvedTheme === 'dark');
    };

    applyTheme();

    localStorage.setItem(STORAGE_KEY, theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyTheme);

    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme]);

  return {
    theme,
    setTheme,
  };
}
