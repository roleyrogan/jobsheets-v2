import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    // Edge function entry uses Deno triple-slash refs
    'supabase/functions/**',
    // Pre-rewrite app kept until Phase 1 step 9
    'src/App.tsx',
    'src/supabase.ts',
    'src/types.ts',
    'src/hooks/**',
    'src/utils/**',
    'src/lib/heroui-button.ts',
    'src/components/*.tsx',
    'src/components/*.d.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      // shadcn primitives export helpers alongside components
      'react-refresh/only-export-components': 'off',
    },
  },
])
