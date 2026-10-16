import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'tests/lib/**/*.js',
      'tests/util/**/*.js',
      'tests/index.js',
      'tests/flat-config.js',
    ],
    // ESLint's RuleTester picks up the global `describe` / `it`
    globals: true,
    coverage: {
      provider: 'v8',
      include: ['index.js', 'lib/**/*.js', 'configs/**/*.js'],
      // json-summary / json are read by davelosert/vitest-coverage-report-action to comment on PRs
      reporter: ['text-summary', 'lcov', 'json-summary', 'json'],
      reportOnFailure: true,
    },
  },
});
