// CommonJS version of ESLint config for compatibility
const globals = require('globals');
const js = require('@eslint/js');
const pluginQuery = require('@tanstack/eslint-plugin-query');
const reactHooks = require('eslint-plugin-react-hooks');
const tseslint = require('typescript-eslint');

// We need to export a CommonJS module
module.exports = tseslint.config(
  { ignores: ['dist', 'src/components/ui', '.next/**/*'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginQuery.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-console': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  }
); 