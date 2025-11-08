import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

/**
 * Hook to sync Redux theme state with HTML class for dark mode
 */
export function useTheme() {
  const theme = useSelector((state: RootState) => state.ui.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
}

