'use strict';

const assert = require('assert');
const sinon = require('sinon');

const eslintUtil = require('../../lib/util/eslint');

describe('eslint', () => {
  describe('isSpaceBetween', () => {
    const first = {};
    const second = {};

    it('uses isSpaceBetween when available', () => {
      const sourceCode = {
        isSpaceBetween: sinon.stub().returns(true),
        getTokensBetween: sinon.stub().returns([]),
      };

      assert.equal(eslintUtil.isSpaceBetween(sourceCode, first, second), true);
      assert(sourceCode.isSpaceBetween.calledOnceWithExactly(first, second));
      assert.equal(sourceCode.getTokensBetween.callCount, 0);
    });

    it('preserves whitespace inside JSXText tokens', () => {
      const rangedFirst = { range: [0, 1] };
      const rangedSecond = { range: [3, 4] };
      const sourceCode = {
        isSpaceBetween: sinon.stub().returns(false),
        getTokensBetween: sinon.stub().returns([{ type: 'JSXText', value: ' ' }]),
      };

      assert.equal(eslintUtil.isSpaceBetween(sourceCode, rangedFirst, rangedSecond), true);
      assert(sourceCode.getTokensBetween.calledOnceWithExactly(rangedFirst, rangedSecond));
    });

    it('falls back to isSpaceBetweenTokens', () => {
      const sourceCode = {
        isSpaceBetweenTokens: sinon.stub().returns(true),
      };

      assert.equal(eslintUtil.isSpaceBetween(sourceCode, first, second), true);
      assert(sourceCode.isSpaceBetweenTokens.calledOnceWithExactly(first, second));
    });
  });
});
