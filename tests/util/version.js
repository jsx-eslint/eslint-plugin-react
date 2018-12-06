/* eslint-env mocha */
'use strict';

const path = require('path');
const assert = require('assert');
const versionUtil = require('../../lib/util/version');

describe('Version', () => {
  const base = path.resolve(__dirname, '..', 'fixtures', 'version');
  let cwd;

  beforeEach(() => {
    cwd = process.cwd();
    process.chdir(base);
  });

  afterEach(() => {
    process.chdir(cwd);
  });

  describe('Detect version', () => {
    const context = {settings: {react: {version: 'detect'}}};

    it('matches detected version', () => {
      process.chdir('detect-version');
      assert.equal(versionUtil.testReactVersion(context, '1.2.3'), true);
      assert.equal(versionUtil.testReactVersion(context, '1.2.4'), false);
    });

    it('assumes latest version if react is not installed', () => {
      assert.equal(versionUtil.testReactVersion(context, '999.999.999'), true);
    });
  });

  describe('non-string version', () => {
    const context = {settings: {react: {version: 15.0, flowVersion: 1.2}}};

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
});
