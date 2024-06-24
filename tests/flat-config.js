/* eslint-env mocha */

'use strict';

const semver = require('semver');
const eslintPkg = require('eslint/package.json');

if (semver.major(eslintPkg.version) < 9) {
  return;
}

const ESLint = require('eslint').ESLint;
const path = require('path');
const assert = require('assert');

describe('eslint-plugin-react in flat config', () => {
  const fixturesdDir = path.resolve(__dirname, 'fixtures', 'flat-config');

  it('should work when the plugin is used directly', () => {
    const eslint = new ESLint({
      cwd: path.resolve(fixturesdDir, 'simple'),
    });

    return eslint.lintFiles(['test.jsx']).then((results) => {
      const result = results[0];

      assert.strictEqual(result.messages.length, 1);
      assert.strictEqual(result.messages[0].severity, 1);
      assert.strictEqual(result.messages[0].ruleId, 'react/jsx-no-literals');
      assert.strictEqual(result.messages[0].messageId, 'literalNotInJSXExpression');
    });
  });
});
