'use client';

import { useThemeContext } from '@/components/ThemeContext';
import PushableButton from '../PushableButton';

type ThemeToggleProps = {
  size?: 16 | 24 | 32 | 40 | 48 | 64 | 128;
};

const ThemeToggle = ({ size = 48 }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useThemeContext();

  const toggleTheme = () => (resolvedTheme === 'dark' ? setTheme('light') : setTheme('dark'));

  return (
    <div onClick={toggleTheme} className="cursor-pointer text-flame-500">
      {resolvedTheme === 'dark' ? (
        <PushableButton
          shape="sun"
          size={size}
          frontColor="var(--flame-500)"
          backColor="var(--gray-100)"
        />
      ) : (
        <PushableButton
          shape="moon"
          size={size}
          frontColor="var(--flame-500)"
          backColor="var(--gray-900)"
        />
      )}
    </div>
  );
};

export default ThemeToggle;
