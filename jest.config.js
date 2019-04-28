'use strict';

module.exports = {
  clearMocks: true,
  coverageDirectory: 'reports/coverage',
  testEnvironment: 'node',
  testMatch: [
    '**/tests/lib/**/*.[jt]s?(x)',
    '**/tests/util/**/*.[jt]s?(x)',
    '**/tests/index.[jt]s?(x)'
  ]
};
