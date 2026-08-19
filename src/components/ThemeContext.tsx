'use client';

import { createContext, useContext, FC, ReactNode } from 'react';
import { useTheme } from 'next-themes';
import { UseThemeProps } from 'next-themes/dist/types';

// Extend UseThemeProps to include all properties returned by useTheme(),
// resolving the TypeScript error for 'setThemes' and other optional properties.
interface FullUseThemeProps extends UseThemeProps {
  // These properties are present on the object returned by useTheme()
  // but are not guaranteed to be on the imported UseThemeProps type.
  theme: string | undefined;
  systemTheme: 'light' | 'dark' | undefined;
  themes: string[];
  setThemes: React.Dispatch<React.SetStateAction<string[]>>;
}

// Initialize the context with the new, fully defined interface.
const ThemeContext = createContext<FullUseThemeProps>({} as FullUseThemeProps);

// --- Hook for Consumption ---

/**
 * Custom hook to consume the theme context, providing full type safety.
 */
export const useThemeContext = () => useContext(ThemeContext);

// --- Context Provider Component ---

interface ThemeContextProviderProps {
  children: ReactNode;
}

/**
 * Provides the complete theme state and setter functions from next-themes.
 */
const ThemeContextProvider: FC<ThemeContextProviderProps> = ({ children }) => {
  // Destructure all values returned by the next-themes hook.
  const contextValue = useTheme() as FullUseThemeProps;

  // The context value now contains the full set of properties, including `setThemes`.
  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeContextProvider;
