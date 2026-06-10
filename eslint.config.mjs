import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  // Build output, vendored, legacy, and static-site dirs are out of scope.
  // Linting targets the live React app in src/ plus the Node build scripts.
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src-tauri/target/**',
      'frontend/**', // legacy pre-v3 vanilla-JS renderer
      'electron/**', // legacy Electron build
      'docs/**', // static landing page
      'landing/**', // static landing page
      '.snapshots/**',
    ],
  },

  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'], // React 17+ automatic JSX runtime — no `import React`
  reactHooks.configs.flat['recommended-latest'],

  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser, // src/ runs in the webview
        ...globals.node, // vite.config.js + scripts/ run in Node
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/prop-types': 'off', // no PropTypes in this codebase
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }], // intentional `catch {}` is fine
      // Advisory perf rule (react-hooks v7): the codebase intentionally syncs
      // external config/props into state inside effects. Surface it, don't block.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]
