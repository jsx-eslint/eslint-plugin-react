'use strict';

const path = require('path');
const assert = require('assert');
const sinon = require('sinon');
const versionUtil = require('../../lib/util/version');

describe('Version', () => {
  const base = path.resolve(__dirname, '..', 'fixtures', 'version');
  let cwd;
  let expectedErrorArgs = [];

  beforeEach(() => {
    cwd = process.cwd();
    process.chdir(base);
    sinon.stub(console, 'error');
    expectedErrorArgs = [];
    versionUtil.resetWarningFlag();
  });

  afterEach(() => {
    process.chdir(cwd);

    const actualArgs = console.error.args; // eslint-disable-line no-console
    console.error.restore(); // eslint-disable-line no-console
    assert.deepEqual(actualArgs, expectedErrorArgs);
  });

  describe('Detect version', () => {
    const context = {settings: {react: {version: 'detect', flowVersion: 'detect'}}};

    it('matches detected version', () => {
      process.chdir('detect-version');
      assert.equal(versionUtil.testReactVersion(context, '1.2.3'), true);
      assert.equal(versionUtil.testReactVersion(context, '1.2.4'), false);
      assert.equal(versionUtil.testFlowVersion(context, '0.92.0'), true);
    });

    it('assumes latest version if react is not installed', () => {
      assert.equal(versionUtil.testReactVersion(context, '999.999.999'), true);

      expectedErrorArgs = [
        ['Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.']
      ];
    });

    it('warns only once for failure to detect react ', () => {
      assert.equal(versionUtil.testReactVersion(context, '999.999.999'), true);
      assert.equal(versionUtil.testReactVersion(context, '999.999.999'), true);

      expectedErrorArgs = [
        ['Warning: React version was set to "detect" in eslint-plugin-react settings, but the "react" package is not installed. Assuming latest React version for linting.']
      ];
    });

    it('assumes latest version if flow-bin is not installed', () => {
      assert.equal(versionUtil.testFlowVersion(context, '999.999.999'), true);

      expectedErrorArgs = [
        ['Warning: Flow version was set to "detect" in eslint-plugin-react settings, but the "flow-bin" package is not installed. Assuming latest Flow version for linting.']
      ];
    });
  });

  describe('string version', () => {
    const context = {settings: {react: {version: '15.0', flowVersion: '1.2'}}};

    it('works with react', () => {
      assert.equal(versionUtil.testReactVersion(context, '0.14.0'), true);
      assert.equal(versionUtil.testReactVersion(context, '15.0.0'), true);
      assert.equal(versionUtil.testReactVersion(context, '16.0.0'), false);
    });

    it('works with flow', () => {
      assert.equal(versionUtil.testFlowVersion(context, '1.1.0'), true);
      assert.equal(versionUtil.testFlowVersion(context, '1.2.0'), true);
      assert.equal(versionUtil.testFlowVersion(context, '1.3.0'), false);
    });
  });

  describe('non-string version', () => {
    const context = {settings: {react: {version: 15.0, flowVersion: 1.2}}};

    it('works with react', () => {
      assert.equal(versionUtil.testReactVersion(context, '0.14.0'), true);
      assert.equal(versionUtil.testReactVersion(context, '15.0.0'), true);
      assert.equal(versionUtil.testReactVersion(context, '16.0.0'), false);

      expectedErrorArgs = [
        ['Warning: React version specified in eslint-plugin-react-settings must be a string; got “number”'],
        ['Warning: React version specified in eslint-plugin-react-settings must be a string; got “number”'],
        ['Warning: React version specified in eslint-plugin-react-settings must be a string; got “number”']
      ];
    });

    it('works with flow', () => {
      assert.equal(versionUtil.testFlowVersion(context, '1.1.0'), true);
      assert.equal(versionUtil.testFlowVersion(context, '1.2.0'), true);
      assert.equal(versionUtil.testFlowVersion(context, '1.3.0'), false);

      expectedErrorArgs = [
        ['Warning: Flow version specified in eslint-plugin-react-settings must be a string; got “number”'],
        ['Warning: Flow version specified in eslint-plugin-react-settings must be a string; got “number”'],
        ['Warning: Flow version specified in eslint-plugin-react-settings must be a string; got “number”']
      ];
    });
  });
});
