'use strict';

const assert = require('assert');

const getLatestVariableDefinition = require('../../lib/util/variable').getLatestVariableDefinition;

describe('variable', () => {
  describe('getLatestVariableDefinition', () => {
    it('should return undefined for empty definitions', () => {
      const variable = {
        defs: [],
      };
      assert.equal(getLatestVariableDefinition(variable), undefined);
    });

    it('should return the latest definition', () => {
      const variable = {
        defs: [
          'one',
          'two',
          'latest',
        ],
      };
      assert.equal(getLatestVariableDefinition(variable), 'latest');
    });
  });
});
