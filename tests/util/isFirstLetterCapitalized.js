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
    assert.equal(isFirstLetterCapitalized('_startsWithUnderscore'), false);
    assert.equal(isFirstLetterCapitalized('__startsWithUnderscore'), false);
  });

  it('should return true for capitalized string, with or without leading underscores', () => {
    assert.equal(isFirstLetterCapitalized('IsCapitalized'), true);
    assert.equal(isFirstLetterCapitalized('_IsCapitalized'), true);
    assert.equal(isFirstLetterCapitalized('__IsCapitalized'), true);
    assert.equal(isFirstLetterCapitalized('UPPERCASE'), true);
    assert.equal(isFirstLetterCapitalized('_UPPERCASE'), true);
    assert.equal(isFirstLetterCapitalized('__UPPERCASE'), true);
  });
});
