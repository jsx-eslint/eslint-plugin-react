'use strict';

const assert = require('assert');

const variableUtil = require('../../lib/util/variable');

const getLatestVariableDefinition = variableUtil.getLatestVariableDefinition;
const resolveVariable = variableUtil.resolveVariable;

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

  describe('resolveVariable', () => {
    const outerX = { name: 'x', scope: 'outer' };
    const innerX = { name: 'x', scope: 'inner' };
    const outer = { upper: null, set: new Map([['x', outerX], ['y', { name: 'y' }]]) };
    const inner = { upper: outer, set: new Map([['x', innerX]]) };

    it('finds a variable in the given scope', () => {
      assert.equal(resolveVariable(inner, 'x'), innerX);
    });

    it('finds a variable in an enclosing scope', () => {
      assert.equal(resolveVariable(inner, 'y').name, 'y');
      assert.equal(resolveVariable(outer, 'x'), outerX);
    });

    it('returns null for an undeclared name', () => {
      assert.equal(resolveVariable(inner, 'z'), null);
    });
  });
});
