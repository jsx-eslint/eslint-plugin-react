'use strict';

const assert = require('assert');
const sinon = require('sinon');
const espree = require('espree');

const ast = require('../../lib/util/ast');

const traverseReturns = ast.traverseReturns;

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
        ({prop}) => 'someething'
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

      enterCalls.forEach((node, idx) => {
        assert.strictEqual(node.lastArg.argument.value, idx);
      });
    });
  });
});
