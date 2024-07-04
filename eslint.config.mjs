import { ESLint } from 'eslint';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import nodePlugin from 'eslint-plugin-node';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    parser: typescriptParser,
    plugins: [
      typescriptPlugin,
      nodePlugin,
      prettierPlugin,
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:node/recommended',
      'plugin:prettier/recommended',
    ],
    env: {
      browser: false,
      es2021: true,
      node: true,
    },
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'prettier/prettier': ['error'],
      '@typescript-eslint/no-unused-vars': ['error'],
    },
  },
  {
    files: ['test/**/*.ts'],
    env: {
      mocha: true,
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
];
