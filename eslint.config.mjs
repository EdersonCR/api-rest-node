import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Configuração base JS
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    rules: js.configs.recommended.rules,
  },

  // Configuração base TypeScript
  ...tseslint.configs.recommended,

  // Suas regras personalizadas
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      semi: ['error', 'always'],
      indent: ['error', 2],
      quotes: ['error', 'single'],
    },
  },
]);