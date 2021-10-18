'use strict';

const assert = require('assert');
const propWrapperUtil = require('../../lib/util/propWrapper');

describe('PropWrapperFunctions', () => {
  describe('getPropWrapperFunctions', () => {
    it('returns set of functions if setting exists', () => {
      const propWrapperFunctions = [
        'Object.freeze',
        {
          property: 'forbidExtraProps',
        },
      ];
      const context = {
        settings: {
          propWrapperFunctions,
        },
      };
      assert.deepStrictEqual(propWrapperUtil.getPropWrapperFunctions(context), new Set(propWrapperFunctions));
    });

    it('returns empty set if no setting', () => {
      const context = {
        settings: {},
      };
      assert.deepStrictEqual(propWrapperUtil.getPropWrapperFunctions(context), new Set([]));
    });
  });

  describe('isPropWrapperFunction', () => {
    it('with string', () => {
      const context = {
        settings: {
          propWrapperFunctions: ['Object.freeze'],
        },
      };
      assert.equal(propWrapperUtil.isPropWrapperFunction(context, 'Object.freeze'), true);
    });

    it('with Object with object and property keys', () => {
      const context = {
        settings: {
          propWrapperFunctions: [
            {
              property: 'freeze',
              object: 'Object',
            },
          ],
        },
      };
      assert.equal(propWrapperUtil.isPropWrapperFunction(context, 'Object.freeze'), true);
    });

    it('with Object with only property key', () => {
      const context = {
        settings: {
          propWrapperFunctions: [
            {
              property: 'forbidExtraProps',
            },
          ],
        },
      };
      assert.equal(propWrapperUtil.isPropWrapperFunction(context, 'forbidExtraProps'), true);
    });
  });

  describe('getExactPropWrapperFunctions', () => {
    it('returns set of functions if setting exists', () => {
      const propWrapperFunctions = [
        'Object.freeze',
        {
          property: 'forbidExtraProps',
          exact: true,
        },
      ];
      const context = {
        settings: {
          propWrapperFunctions,
        },
      };
      assert.deepStrictEqual(propWrapperUtil.getExactPropWrapperFunctions(context), new Set([{
        property: 'forbidExtraProps',
        exact: true,
      }]));
    });

    it('returns empty set if no exact prop wrappers', () => {
      const propWrapperFunctions = [
        'Object.freeze',
        {
          property: 'forbidExtraProps',
        },
      ];
      const context = {
        settings: {
          propWrapperFunctions,
        },
      };
      assert.deepStrictEqual(propWrapperUtil.getExactPropWrapperFunctions(context), new Set([]));
    });

    it('returns empty set if no setting', () => {
      const context = {
        settings: {},
      };
      assert.deepStrictEqual(propWrapperUtil.getExactPropWrapperFunctions(context), new Set([]));
    });
  });

  describe('isExactPropWrapperFunction', () => {
    it('with string', () => {
      const context = {
        settings: {
          propWrapperFunctions: ['Object.freeze'],
        },
      };
      assert.equal(propWrapperUtil.isExactPropWrapperFunction(context, 'Object.freeze'), false);
    });

    it('with Object with object and property keys', () => {
      const context = {
        settings: {
          propWrapperFunctions: [
            {
              property: 'freeze',
              object: 'Object',
              exact: true,
            },
          ],
        },
      };
      assert.equal(propWrapperUtil.isExactPropWrapperFunction(context, 'Object.freeze'), true);
    });

    it('with Object with only property key', () => {
      const context = {
        settings: {
          propWrapperFunctions: [
            {
              property: 'forbidExtraProps',
              exact: true,
            },
          ],
        },
      };
      assert.equal(propWrapperUtil.isExactPropWrapperFunction(context, 'forbidExtraProps'), true);
    });
  });

  describe('formatPropWrapperFunctions', () => {
    it('with empty set', () => {
      const propWrappers = new Set([]);
      assert.equal(propWrapperUtil.formatPropWrapperFunctions(propWrappers), '');
    });

    it('with all allowed values', () => {
      const propWrappers = new Set([
        'Object.freeze',
        {
          property: 'exact',
          exact: true,
        },
        {
          property: 'bar',
          object: 'foo',
        },
      ]);
      assert.equal(propWrapperUtil.formatPropWrapperFunctions(propWrappers), '\'Object.freeze\', \'exact\', \'foo.bar\'');
    });
  });
});
