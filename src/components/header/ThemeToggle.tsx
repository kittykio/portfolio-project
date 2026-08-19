'use client';

import { useThemeContext } from '@/components/ThemeContext';
import PushableButton from '../PushableButton';

// Defines the props for the ThemeToggle component.
type ThemeToggleProps = {
  // Optional size property for the button, constrained to specific pixel values.
  size?: 16 | 24 | 32 | 40 | 48 | 64 | 128;
};

// A component that toggles between light and dark themes using an animated button.
const ThemeToggle = ({ size = 48 }: ThemeToggleProps) => {
  // Accesses the current theme and the function to change the theme from the context.
  const { resolvedTheme, setTheme } = useThemeContext();

  // Function to switch the theme: dark to light, or light to dark.
  const toggleTheme = () => (resolvedTheme === 'dark' ? setTheme('light') : setTheme('dark'));

  return (
    // Clickable container that triggers the theme change.
    <div onClick={toggleTheme} className="cursor-pointer text-flame-500">
      {/* Renders the Sun button when the theme is dark. */}
      {resolvedTheme === 'dark' ? (
        <PushableButton
          // Sets the button shape to 'sun'.
          shape="sun"
          // Passes the specified size.
          size={size}
          // Sets the front color (icon color) to a flame red variable.
          frontColor="var(--flame-500)"
          // Sets the back color (background) to a light gray variable.
          backColor="var(--gray-100)"
        />
      ) : (
        // Renders the Moon button when the theme is light.
        <PushableButton
          // Sets the button shape to 'moon'.
          shape="moon"
          // Passes the specified size.
          size={size}
          // Sets the front color (icon color) to a flame red variable.
          frontColor="var(--flame-500)"
          // Sets the back color (background) to a dark gray variable.
          backColor="var(--gray-900)"
        />
      )}
    </div>
  );
};

export default ThemeToggle;
