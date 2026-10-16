// Ported from the tests of jsx-ast-utils (MIT, Copyright (c) 2016 Ethan Cohen), see lib/util/jsx-ast-utils/LICENSE

import { beforeEach, describe, it } from 'vitest';
import assert from 'assert';
import { getOpeningElement, setParserName } from './helper.mjs';
import elementTypeModule from '../../../lib/util/jsx-ast-utils/elementType.js';

const elementType = elementTypeModule.default;

describe('elementType tests', () => {
  beforeEach(() => {
    setParserName('babel');
  });
  it('should export a function', () => {
    const expected = 'function';
    const actual = typeof elementType;

    assert.equal(actual, expected);
  });

  it('should throw an error if the argument is missing', () => {
    assert.throws(() => { elementType(); }, Error);
  });

  it('should throw an error if the argument not a JSX node', () => {
    assert.throws(() => { elementType({ a: 'foo' }); }, Error);
  });

  it('should return the correct type of the DOM element given its node object', () => {
    const code = '<div />';
    const node = getOpeningElement(code);

    const expected = 'div';
    const actual = elementType(node);

    assert.equal(actual, expected);
  });

  it('should return the correct type of the custom element given its node object', () => {
    const code = '<Slider />';
    const node = getOpeningElement(code);

    const expected = 'Slider';
    const actual = elementType(node);

    assert.equal(actual, expected);
  });

  it('should return the correct type of the custom object element given its node object', () => {
    const code = '<UX.Slider />';
    const node = getOpeningElement(code);

    const expected = 'UX.Slider';
    const actual = elementType(node);

    assert.equal(actual, expected);
  });

  it('should return the correct type of the namespaced element given its node object', () => {
    const code = '<UX:Slider />';
    const node = getOpeningElement(code);

    const expected = 'UX:Slider';
    const actual = elementType(node);

    assert.equal(actual, expected);
  });

  it('should return the correct type of the multiple custom object element given its node object', () => {
    const code = '<UX.Slider.Blue.Light />';
    const node = getOpeningElement(code);

    const expected = 'UX.Slider.Blue.Light';
    const actual = elementType(node);

    assert.equal(actual, expected);
  });

  it('should return this.Component when given its node object', () => {
    const code = '<this.Component />';
    const node = getOpeningElement(code);

    const expected = 'this.Component';
    const actual = elementType(node);

    assert.equal(actual, expected);
  });

  describe('fragments', () => {
    it('should work with fragments', () => {
      const code = '<>foo</>';
      const node = getOpeningElement(code);

      const expected = '<>';
      const actual = elementType(node);

      assert.equal(actual, expected);
    });

    it('works with nested fragments', () => {
      const code = `
        <Hello
          role="checkbox"
          frag={
            <>
              <div>Hello</div>
              <>
                <div>There</div>
              </>
            </>
          }
        />
      `;
      const node = getOpeningElement(code);

      const expected = 'Hello';
      const actual = elementType(node);

      assert.equal(actual, expected);
    });
  });
});
