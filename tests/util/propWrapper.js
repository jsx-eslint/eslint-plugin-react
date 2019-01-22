'use strict';

const assert = require('assert');
const propWrapperUtil = require('../../lib/util/propWrapper');

describe('PropWrapperFunctions', () => {
  describe('getPropWrapperFunctions', () => {
    it('returns set of functions if setting exists', () => {
      const propWrapperFunctions = ['Object.freeze', {
        property: 'forbidExtraProps'
      }];
      const context = {
        settings: {
          propWrapperFunctions: propWrapperFunctions
        }
      };
      assert.deepStrictEqual(propWrapperUtil.getPropWrapperFunctions(context), new Set(propWrapperFunctions));
    });

    it('returns empty array if no setting', () => {
      const context = {
        settings: {}
      };
      assert.deepStrictEqual(propWrapperUtil.getPropWrapperFunctions(context), new Set([]));
    });
  });

  describe('isPropWrapperFunction', () => {
    it('with string', () => {
      const context = {
        settings: {
          propWrapperFunctions: ['Object.freeze']
        }
      };
      assert.equal(propWrapperUtil.isPropWrapperFunction(context, 'Object.freeze'), true);
    });

    it('with Object with object and property keys', () => {
      const context = {
        settings: {
          propWrapperFunctions: [{
            property: 'freeze',
            object: 'Object'
          }]
        }
      };
      assert.equal(propWrapperUtil.isPropWrapperFunction(context, 'Object.freeze'), true);
    });

    it('with Object with only property key', () => {
      const context = {
        settings: {
          propWrapperFunctions: [{
            property: 'forbidExtraProps'
          }]
        }
      };
      assert.equal(propWrapperUtil.isPropWrapperFunction(context, 'forbidExtraProps'), true);
    });
  });
});
