'use strict';

const assert = require('assert');
const espree = require('espree');
const props = require('../../lib/util/props');

function properties(code) {
  return espree.parse(`const component = { ${code} };`, { ecmaVersion: 2018 }).body[0].declarations[0].init.properties;
}

describe('props declaration names', () => {
  it('recognizes statically named quoted keys', () => {
    const nodes = properties('"propTypes": {}, ["defaultProps"]: {}, ["contextTypes"]: {}');
    assert.strictEqual(props.isPropTypesDeclaration(nodes[0]), true);
    assert.strictEqual(props.isDefaultPropsDeclaration(nodes[1]), true);
    assert.strictEqual(props.isContextTypesDeclaration(nodes[2]), true);
  });

  it('does not mistake dynamic computed keys for declarations', () => {
    const nodes = properties('[propTypes]: {}, [defaultProps]: {}, [contextTypes]: {}');
    assert.strictEqual(props.isPropTypesDeclaration(nodes[0]), false);
    assert.strictEqual(props.isDefaultPropsDeclaration(nodes[1]), false);
    assert.strictEqual(props.isContextTypesDeclaration(nodes[2]), false);
  });
});
