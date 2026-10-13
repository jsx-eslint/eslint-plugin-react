'use strict';

const assert = require('assert');
const sinon = require('sinon');
const espree = require('espree');

const ast = require('../../lib/util/ast');

const traverseReturns = ast.traverseReturns;
const isFunctionLike = ast.isFunctionLike;
const getPropertyName = ast.getPropertyName;

const DEFAULT_CONFIG = {
  ecmaVersion: 6,
};

const parseCode = (code) => {
  const ASTnode = espree.parse(code, DEFAULT_CONFIG);
  // Return only first statement
  return ASTnode.body[0];
};

const mockContext = {};

describe('ast', () => {
  describe('traverseReturnStatements', () => {
    it('Correctly traverses function declarations', () => {
      const spy = sinon.spy();
      traverseReturns(parseCode(`
        function foo({prop}) {
          return;
        }
      `), mockContext, spy);

      assert(spy.calledOnce);
    });

    it('Correctly traverses function expressions', () => {
      const spy = sinon.spy();
      traverseReturns(parseCode(`
        const foo = function({prop}) {
          return;
        }
      `).declarations[0].init, mockContext, spy);

      assert(spy.calledOnce);
    });

    it('Correctly traverses arrow functions', () => {
      const spy = sinon.spy();
      traverseReturns(parseCode(`
        ({prop}) => {
          return;
        }
      `).expression, mockContext, spy);

      assert(spy.calledOnce);

      spy.resetHistory();

      traverseReturns(parseCode(`
        ({prop}) => 'something'
      `).expression, mockContext, spy);

      assert(spy.calledOnce);
    });

    it('Correctly traverses inside control flow expressions', () => {
      const spy = sinon.spy();
      traverseReturns(parseCode(`
        function foo({prop}) {
          if (prop) {
            return 0;
          } else {
            return 1;
          }

          while(prop) {
            return 2;
          }

          for (;;) {
            return 3;
          }

          switch (prop) {
            case 'a':
              return 4;
            default:
              return 5;
          }

          const foo = () => 'not valid';
        }
      `), mockContext, spy);

      const enterCalls = spy.getCalls();

      assert.strictEqual(enterCalls.length, 6);

      enterCalls.forEach((call, idx) => {
        assert.strictEqual(call.args[0].value, idx);
      });
    });
  });

  describe('isFunctionLike()', () => {
    it('FunctionDeclaration should return true', () => {
      const node1 = parseCode(`
        function foo(bar) {
          const asdf = () => 'zxcv';
          return asdf;
        }
      `);
      assert.strictEqual(isFunctionLike(node1), true);

      const node2 = parseCode(`
        function foo({bar}) {
          const asdf = () => 'zxcv';
          console.log(bar);
          return '5'
        }
      `);
      assert.strictEqual(isFunctionLike(node2), true);
    });

    it('FunctionExpression should return true', () => {
      const node1 = parseCode(`
        const foo = function(bar) {
          return () => 'zxcv';
        }
      `).declarations[0].init;
      assert.strictEqual(isFunctionLike(node1), true);

      const node2 = parseCode(`
        const foo = function ({bar}) {
          return '5';
        }
      `).declarations[0].init;
      assert.strictEqual(isFunctionLike(node2), true);
    });

    it('ArrowFunctionExpression should return true', () => {
      const node1 = parseCode(`
        (bar) => {
          return () => 'zxcv';
        }
      `).expression;
      assert.strictEqual(isFunctionLike(node1), true);

      const node2 = parseCode(`
        ({bar}) => '5';
      `).expression;
      assert.strictEqual(isFunctionLike(node2), true);

      const node3 = parseCode(`
        bar => '5';
      `).expression;
      assert.strictEqual(isFunctionLike(node3), true);
    });

    it('Non-functions should return false', () => {
      const node1 = parseCode(`
        class bar {
          a() {
            return 'a';
          }
        }
      `);
      assert.strictEqual(isFunctionLike(node1), false);

      const node2 = parseCode(`
        const a = 5;
      `);
      assert.strictEqual(isFunctionLike(node2), false);
    });
  });

  describe('getPropertyName()', () => {
    it('returns static identifier and string property names', () => {
      const properties = parseCode(`
        const value = { foo: 1, ['bar']: 2 };
      `).declarations[0].init.properties;

      assert.strictEqual(getPropertyName(properties[0]), 'foo');
      assert.strictEqual(getPropertyName(properties[1]), 'bar');
    });

    it('ignores dynamic computed and non-string property names', () => {
      const properties = parseCode(`
        const value = { [key]: 1, 3: 2 };
      `).declarations[0].init.properties;

      assert.strictEqual(getPropertyName(properties[0]), '');
      assert.strictEqual(getPropertyName(properties[1]), '');
    });

    it('returns static member names and ignores dynamic members', () => {
      const staticMember = parseCode('value.foo;').expression;
      const computedMember = parseCode('value["bar"];').expression;
      const dynamicMember = parseCode('value[key];').expression;

      assert.strictEqual(getPropertyName(staticMember), 'foo');
      assert.strictEqual(getPropertyName(computedMember), 'bar');
      assert.strictEqual(getPropertyName(dynamicMember), '');
    });
  });
});
