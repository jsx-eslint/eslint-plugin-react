/* eslint-env mocha */

'use strict';

const semver = require('semver');
const eslintPkg = require('eslint/package.json');

if (!semver.satisfies(eslintPkg.version, '>= 8.57.0')) {
  return;
}

const ESLint = semver.major(eslintPkg.version) < 9
  ? require('eslint/use-at-your-own-risk').FlatESLint // eslint-disable-line import/no-unresolved -- false positive
  : require('eslint').ESLint;

const path = require('path');
const assert = require('assert');

describe('eslint-plugin-react in flat config', () => {
  const fixturesdDir = path.resolve(__dirname, 'fixtures', 'flat-config');

  it('should work when the plugin is used directly', () => {
    const eslint = new ESLint({
      cwd: path.resolve(fixturesdDir, 'plugin'),
    });

    return eslint.lintFiles(['test.jsx']).then((results) => {
      const result = results[0];

      assert.strictEqual(result.messages.length, 1);
      assert.strictEqual(result.messages[0].severity, 1);
      assert.strictEqual(result.messages[0].ruleId, 'react/jsx-no-literals');
      assert.strictEqual(result.messages[0].messageId, 'literalNotInJSXExpression');
    });
  });

  ['root', 'deep'].forEach((configAccess) => {
    const overrideConfigFile = `eslint.config-${configAccess}.js`;

    it(`should work when the plugin is used with "all" config (${configAccess})`, () => {
      const eslint = new ESLint({
        cwd: path.resolve(fixturesdDir, 'config-all'),
        overrideConfigFile,
      });

      return eslint.lintFiles(['test.jsx']).then((results) => {
        const result = results[0];

        assert.strictEqual(result.messages.length, 3);
        assert.strictEqual(result.messages[0].severity, 2);
        assert.strictEqual(result.messages[0].ruleId, 'react/react-in-jsx-scope');
        assert.strictEqual(result.messages[0].messageId, 'notInScope');
        assert.strictEqual(result.messages[1].severity, 2);
        assert.strictEqual(result.messages[1].ruleId, 'react/no-unknown-property');
        assert.strictEqual(result.messages[1].messageId, 'unknownProp');
        assert.strictEqual(result.messages[2].severity, 2);
        assert.strictEqual(result.messages[2].ruleId, 'react/jsx-no-literals');
        assert.strictEqual(result.messages[2].messageId, 'literalNotInJSXExpression');
      });
    });

    it(`should work when the plugin is used with "recommended" config (${configAccess})`, () => {
      const eslint = new ESLint({
        cwd: path.resolve(fixturesdDir, 'config-recommended'),
        overrideConfigFile,
      });

      return eslint.lintFiles(['test.jsx']).then((results) => {
        const result = results[0];

        assert.strictEqual(result.messages.length, 2);
        assert.strictEqual(result.messages[0].severity, 2);
        assert.strictEqual(result.messages[0].ruleId, 'react/react-in-jsx-scope');
        assert.strictEqual(result.messages[0].messageId, 'notInScope');
        assert.strictEqual(result.messages[1].severity, 2);
        assert.strictEqual(result.messages[1].ruleId, 'react/no-unknown-property');
        assert.strictEqual(result.messages[1].messageId, 'unknownProp');
      });
    });

    it(`should work when the plugin is used with "recommended" and "jsx-runtime" configs (${configAccess})`, () => {
      const eslint = new ESLint({
        cwd: path.resolve(fixturesdDir, 'config-jsx-runtime'),
        overrideConfigFile,
      });

      return eslint.lintFiles(['test.jsx']).then((results) => {
        const result = results[0];

        assert.strictEqual(result.messages.length, 1);
        assert.strictEqual(result.messages[0].severity, 2);
        assert.strictEqual(result.messages[0].ruleId, 'react/no-unknown-property');
        assert.strictEqual(result.messages[0].messageId, 'unknownProp');
      });
    });

    // https://github.com/jsx-eslint/eslint-plugin-react/issues/3693
    it(`should work when the plugin is used directly and with "recommended" config (${configAccess})`, () => {
      const eslint = new ESLint({
        cwd: path.resolve(fixturesdDir, 'plugin-and-config'),
        overrideConfigFile,
      });

      return eslint.lintFiles(['test.jsx']).then((results) => {
        const result = results[0];

        assert.strictEqual(result.messages.length, 2);
        assert.strictEqual(result.messages[0].severity, 2);
        assert.strictEqual(result.messages[0].ruleId, 'react/react-in-jsx-scope');
        assert.strictEqual(result.messages[0].messageId, 'notInScope');
        assert.strictEqual(result.messages[1].severity, 2);
        assert.strictEqual(result.messages[1].ruleId, 'react/no-unknown-property');
        assert.strictEqual(result.messages[1].messageId, 'unknownProp');
      });
    });
  });
});
