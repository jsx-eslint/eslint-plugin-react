'use strict';
module.exports = {
  collectCoverage: true,
  coverageDirectory: '<rootDir>/reports/coverage',
  coverageThreshold: {
    global: {
      statements: 96.48,
      branches: 94.07,
      functions: 99.53,
      lines: 96.44
    }
  },
  testURL: 'https://localhost/',
  testMatch: ['<rootDir>/tests/**/*.js']
};

