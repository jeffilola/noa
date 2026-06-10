'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiMonitor, FiMoon, FiSun } from 'react-icons/fi';

const MODES = [
  { value: 'system', label: 'System theme', icon: FiMonitor },
  { value: 'light', label: 'Light theme', icon: FiSun },
  { value: 'dark', label: 'Dark theme', icon: FiMoon },
] as const;

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const active = mounted ? (theme ?? 'system') : 'system';

  return (
    <div
      className={`theme-toggle${compact ? ' theme-toggle--compact' : ''}`}
      role="group"
      aria-label="Color theme"
    >
      {MODES.map(({ value, label, icon: Icon }) => {
        const isActive = active === value;

        return (
          <button
            key={value}
            type="button"
            className={`theme-toggle__button${isActive ? ' is-active' : ''}`}
            aria-pressed={isActive}
            aria-label={label}
            title={label}
            onClick={() => setTheme(value)}
          >
            <Icon aria-hidden />
            {!compact ? <span className="theme-toggle__label">{value}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
