import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

// Get the current file's path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create an instance of FlatCompat with the base directory
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Define the ESLint configuration, extending from Next.js base config and TypeScript
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // You can also add custom rules if needed
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off'
    },
  },
];

// Export the ESLint configuration
export default eslintConfig;
