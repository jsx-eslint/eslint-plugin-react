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
});
