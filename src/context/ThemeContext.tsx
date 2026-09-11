import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { applyThemeColor } from '@/lib/colors';

interface ThemeContextValue {
  themeColor: string;
  setThemeColor: (color: string) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'arb_tech_theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeColor, setThemeColorState] = useState<string>('#00ff66');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setThemeColorState(stored);
        applyThemeColor(stored);
      }
    } catch {
      // ignore
    }
  }, []);

  const setThemeColor = useCallback((color: string) => {
    setThemeColorState(color);
    applyThemeColor(color);
    try {
      localStorage.setItem(STORAGE_KEY, color);
    } catch {
      // ignore
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ themeColor, setThemeColor, settingsOpen, setSettingsOpen }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
