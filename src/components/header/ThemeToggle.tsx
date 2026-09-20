'use client';

import { useThemeContext } from '@/components/ThemeContext';
import PushableButton from '../PushableButton';

type ThemeToggleProps = {
  size?: 16 | 24 | 32 | 40 | 48 | 64 | 128;
};

const ThemeToggle = ({ size = 48 }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useThemeContext();

  const toggleTheme = () => (resolvedTheme === 'dark' ? setTheme('light') : setTheme('dark'));
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <PushableButton
      shape={resolvedTheme === 'dark' ? 'sun' : 'moon'}
      size={size}
      frontColor="var(--flame-500)"
      backColor={resolvedTheme === 'dark' ? 'var(--gray-100)' : 'var(--gray-900)'}
      onClick={toggleTheme}
      ariaLabel={`Switch to ${nextTheme} theme`}
    />
  );
};

export default ThemeToggle;
