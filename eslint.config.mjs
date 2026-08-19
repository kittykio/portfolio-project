import prettier from 'eslint-config-prettier';
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  {
    // 1. Files to lint
    files: ['**/*.{js,jsx,ts,tsx}'],

    // 2. Language/Parser Setup
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        // IMPORTANT: Specify the project's TypeScript configuration file
        project: './tsconfig.json',
      },
      // Define environments for globals (e.g., 'window', 'document', 'module', 'console')
      globals: {
        ...globals.browser,
        ...globals.node,
        // Add specific framework globals if needed (e.g., 'React')
      },
    },

    // 3. Plugins
    plugins: {
      '@typescript-eslint': typescript,
      react: react,
      'react-hooks': reactHooks,
    },

    // 4. Rule Configuration
    rules: {
      // --- General Best Practices ---
      curly: ['error', 'all'],
      // 'no-console': 'warn',

      // --- TypeScript Rules ---
      ...typescript.configs['recommended-type-checked'].rules,
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off', // Often too strict

      // --- React Rules ---
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed for React 17+ (New JSX Transform)
      'react/prop-types': 'off', // Not needed when using TypeScript

      // Enforce the use of arrow functions for functional components
      'react/function-component-definition': [
        'warn', // or 'error'
        {
          namedComponents: 'arrow-function', // For components with names (like MyComponent)
          unnamedComponents: 'arrow-function', // For components without names (like in a default export)
        },
      ],

      'capitalized-comments': [
        'warn',
        'always',
        {
          // Set this to false to check comments that are on the same line as code.
          ignoreInlineComments: false,

          // You should still ignore common technical patterns
          ignorePattern: 'eslint-disable|prettier-ignore|ts-ignore|ts-expect-error|\\*|TODO|FIXME',
          ignoreConsecutiveComments: true,
        },
      ],

      'padding-line-between-statements': [
        'error',
        // Configuration to REQUIRE a blank line before any 'export' statement
        {
          blankLine: 'always',
          prev: '*',
          next: 'export',
        },
      ],
    },
  },

  // 5. Prettier Config (always last to override rules)
  prettier, // Disables ESLint rules that conflict with Prettier formatting
];
