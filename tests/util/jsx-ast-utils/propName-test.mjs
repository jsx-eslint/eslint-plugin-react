// Ported from the tests of jsx-ast-utils (MIT, Copyright (c) 2016 Ethan Cohen), see lib/util/jsx-ast-utils/LICENSE

import { beforeEach, describe, it } from 'vitest';
import assert from 'assert';
import { extractProp, setParserName } from './helper.mjs';
import propNameModule from '../../../lib/util/jsx-ast-utils/propName.js';

const propName = propNameModule.default;

describe('propName', () => {
  beforeEach(() => {
    setParserName('babel');
  });
  it('should export a function', () => {
    const expected = 'function';
    const actual = typeof propName;

    assert.equal(actual, expected);
  });

  it('should throw an error if the argument is missing', () => {
    assert.throws(() => { propName(); }, Error);
  });

  it('should throw an error if the argument not a JSX node', () => {
    assert.throws(() => { propName({ a: 'foo' }); }, Error);
  });

  it('should return correct name for normal prop', () => {
    const prop = extractProp('<div foo="bar" />');

    const expected = 'foo';
    const actual = propName(prop);

    assert.equal(actual, expected);
  });

  it('should return correct name for namespaced prop', () => {
    const prop = extractProp('<div foo:bar="baz" />', 'foo:bar');

    const expected = 'foo:bar';
    const actual = propName(prop);

    assert.equal(actual, expected);
  });
});
