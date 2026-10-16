import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import globals from 'globals';

export default [
  {
    ignores: [
      'coverage/',
      'test-published-types/',
      'tests/fixtures/flat-config/',
      '**/*.d.ts',
    ],
  },

  js.configs.recommended,
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: true,
    arrowParens: true,
    braceStyle: '1tbs',
    commaDangle: 'always-multiline',
  }),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      strict: ['error', 'safe'],

      // keep the existing (airbnb-derived) code style where it differs from the @stylistic defaults
      '@stylistic/quote-props': ['error', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/comma-dangle': ['error', {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      }],
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/indent-binary-ops': 'off',
      '@stylistic/max-statements-per-line': 'off',
      '@stylistic/max-len': ['error', 140, {
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
      }],
    },
  },

  {
    files: ['**/*.mjs'],
    languageOptions: {
      sourceType: 'module',
    },
  },

  {
    files: ['lib/rules/**/*.js'],
    ...eslintPlugin.configs['rules-recommended'],
    rules: {
      ...eslintPlugin.configs['rules-recommended'].rules,
      'eslint-plugin/require-meta-docs-description': ['error', { pattern: '^(Enforce|Require|Disallow)' }],
      'eslint-plugin/require-meta-schema': 'off',
      'eslint-plugin/require-meta-type': 'off',
      // TODO: these change the rules' published `meta` (and how options are resolved), so they are handled separately
      'eslint-plugin/require-meta-schema-description': 'off',
      'eslint-plugin/require-meta-default-options': 'off',
      'eslint-plugin/no-meta-schema-default': 'off',
      'eslint-plugin/no-meta-replaced-by': 'off',
    },
  },

  {
    files: ['tests/**/*.js'],
    ...eslintPlugin.configs['tests-recommended'],
    languageOptions: {
      globals: globals.vitest,
    },
    rules: {
      ...eslintPlugin.configs['tests-recommended'].rules,
      'eslint-plugin/consistent-output': 'off',
      // test cases contain `${...}` in plain strings on purpose
      'no-template-curly-in-string': 'off',
    },
  },
];
