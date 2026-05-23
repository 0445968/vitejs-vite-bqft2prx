import { Moon, Monitor, Sun } from 'lucide-react';

import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const nextTheme = () => {
    if (theme === 'system') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('system');
  };

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <button
      type="button"
      onClick={nextTheme}
      className="icon-button"
      title={`Theme: ${theme}`}
      aria-label={`Current theme: ${theme}`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
