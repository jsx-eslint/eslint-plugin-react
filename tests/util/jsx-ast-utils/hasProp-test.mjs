// Ported from the tests of jsx-ast-utils (MIT, Copyright (c) 2016 Ethan Cohen), see lib/util/jsx-ast-utils/LICENSE

import { beforeEach, describe, it } from 'vitest';
import assert from 'assert';
import { getOpeningElement, setParserName } from './helper.mjs';
import hasPropModule from '../../../lib/util/jsx-ast-utils/hasProp.js';

const hasProp = hasPropModule.default;

describe('hasProp', () => {
  beforeEach(() => {
    setParserName('babel');
  });
  it('should export a function', () => {
    const expected = 'function';
    const actual = typeof hasProp;

    assert.equal(actual, expected);
  });

  it('should return false if no arguments are provided', () => {
    const expected = false;
    const actual = hasProp();

    assert.equal(actual, expected);
  });

  it('should return false if the prop is absent', () => {
    const code = '<div />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = 'id';

    const expected = false;
    const actual = hasProp(props, prop);

    assert.equal(actual, expected);
  });

  it('should return true if the prop exists', () => {
    const code = '<div id="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = 'id';

    const expected = true;
    const actual = hasProp(props, prop);

    assert.equal(actual, expected);
  });

  it('should return true if the prop may exist in spread loose mode', () => {
    const code = '<div {...props} />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = 'id';
    const options = {
      spreadStrict: false,
    };

    const expected = true;
    const actual = hasProp(props, prop, options);

    assert.equal(actual, expected);
  });

  it('should return false if the prop is considered absent in case-sensitive mode', () => {
    const code = '<div ID="foo" />';
    const node = getOpeningElement(code);
    const { attributes: props } = node;
    const prop = 'id';
    const options = {
      ignoreCase: false,
    };

    const expected = false;
    const actual = hasProp(props, prop, options);

    assert.equal(actual, expected);
  });
});
