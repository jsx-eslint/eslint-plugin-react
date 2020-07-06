'use strict';

const assert = require('assert');
const getNodeAncestors = require('../../lib/util/getNodeAncestors');

describe('getNodeAncestors', () => {
  it('returns empty array for null node', () => {
    assert.deepEqual(getNodeAncestors(null), []);
  });
  it('returns list of parents', () => {
    const node = {
      type: 'Identifier',
      parent: {
        type: 'FunctionDeclaration',
        parent: {
          type: 'Program'
        }
      }
    };
    const actual = getNodeAncestors(node);
    const expected = ['FunctionDeclaration', 'Program'];

    actual.forEach((parent, i) => assert.equal(parent.type, expected[i]));
  });
});
