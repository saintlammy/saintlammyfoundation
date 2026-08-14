import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextCoreWebVitals,
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'public/**',
    'scripts/**',
    'supabase/**',
    'database/**',
    'netlify/**'
  ]),
  {
    rules: {
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      // This project predates the stricter React/Next rules shipped by the
      // current flat config. Keep the backlog visible without making lint
      // unusable while those findings are fixed incrementally.
      'react/no-unescaped-entities': 'warn',
      '@next/next/no-html-link-for-pages': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'prefer-const': 'warn',
      'import/no-anonymous-default-export': 'warn'
    }
  }
]);
