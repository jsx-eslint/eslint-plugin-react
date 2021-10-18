'use strict';

const assert = require('assert');
const SourceCode = require('eslint').SourceCode;
const espree = require('espree');

const getFromContext = require('../../lib/util/pragma').getFromContext;

const DEFAULT_CONFIG = {
  ecmaVersion: 6,
  comment: true,
  tokens: true,
  range: true,
  loc: true,
};

const DEFAULT_SETTINGS = {
  react: {
    pragma: 'React',
  },
};

const fakeContext = (code) => {
  const ast = espree.parse(code, DEFAULT_CONFIG);
  return {
    getSourceCode: () => new SourceCode(code, ast),
    settings: DEFAULT_SETTINGS,
  };
};

describe('pragma', () => {
  describe('getFromContext', () => {
    it('finds the pragma in a block comment', () => {
      const code = '/* @jsx jsx */';
      assert.strictEqual(getFromContext(fakeContext(code)), 'jsx');
    });

    it('finds the pragma in a docstring comment', () => {
      const code = '/** @jsx jsx */';
      assert.strictEqual(getFromContext(fakeContext(code)), 'jsx');
    });

    it('finds the pragma in a line comment', () => {
      const code = '// @jsx jsx';
      assert.strictEqual(
        getFromContext(fakeContext(code)),
        'jsx'
      );
    });

    it('defaults to the value of settings.react.pragma', () => {
      const code = '';
      assert.strictEqual(
        getFromContext(fakeContext(code)),
        DEFAULT_SETTINGS.react.pragma
      );
    });

    it('throws an error if the pragma is invalid', () => {
      const code = '/* @jsx invalid-jsx-pragma */';
      assert.throws(() => getFromContext(fakeContext(code)));
    });
  });
});
