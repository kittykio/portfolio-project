// prettier.config.cjs
module.exports = {
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  printWidth: 100,
  trailingComma: 'all',
  arrowParens: 'always',
  endOfLine: 'lf',
  useTabs: false,
  tabWidth: 2,
  overrides: [
    {
      files: ['*.css', '*.scss', '*.less'],
      options: { parser: 'css' },
    },
  ],
};
