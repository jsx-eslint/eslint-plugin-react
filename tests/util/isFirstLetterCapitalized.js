'use strict';

const assert = require('assert');

const isFirstLetterCapitalized = require('../../lib/util/isFirstLetterCapitalized');

describe('isFirstLetterCapitalized', () => {
  it('should return false for invalid input', () => {
    assert.equal(isFirstLetterCapitalized(), false);
    assert.equal(isFirstLetterCapitalized(null), false);
    assert.equal(isFirstLetterCapitalized(''), false);
  });

  it('should return false for uncapitalized string', () => {
    assert.equal(isFirstLetterCapitalized('isCapitalized'), false);
    assert.equal(isFirstLetterCapitalized('lowercase'), false);
  });

  it('should return true for capitalized string', () => {
    assert.equal(isFirstLetterCapitalized('IsCapitalized'), true);
    assert.equal(isFirstLetterCapitalized('UPPERCASE'), true);
  });

  it('should return false for non-letters', () => {
    assert.strictEqual(isFirstLetterCapitalized('42'), false);
    assert.strictEqual(isFirstLetterCapitalized('!'), false);
    assert.strictEqual(isFirstLetterCapitalized('$$$'), false);
    assert.strictEqual(isFirstLetterCapitalized(' Space'), false);
  });
});
