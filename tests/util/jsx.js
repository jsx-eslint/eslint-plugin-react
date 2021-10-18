'use strict';

const assert = require('assert');
const espree = require('espree');

const jsxUtil = require('../../lib/util/jsx');

const isReturningJSX = jsxUtil.isReturningJSX;

const DEFAULT_CONFIG = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true,
  },
};

const parseCode = (code) => {
  const ASTnode = espree.parse(code, DEFAULT_CONFIG);
  // Return only first statement
  return ASTnode.body[0];
};

const mockContext = {};

describe('jsxUtil', () => {
  describe('isReturningJSX', () => {
    const assertValid = (codeStr) => assert(
      isReturningJSX(() => false, parseCode(codeStr), mockContext)
    );

    it('Works when returning JSX', () => {
      assertValid(`
        function Test() {
          return (
            <a>something</a>
          )
        }
      `);

      assertValid(`
        function Test() {
          return <a>something</a>;
        }
      `);
    });

    it('Works when returning null', () => {
      assertValid(`
        function Test() {
          return null;
        }
      `);

      assertValid(`
        function Test({prop}) {
          return prop || null;
        }
      `);
    });

    it('Works with nested return', () => {
      assertValid(`
        function Test({prop}) {
          if (prop) {
            return <a>something</a>
          }
        }
      `);
    });

    it('Can ignore null', () => {
      assertValid(`
        function Test() {
          return null;
        }
      `);
    });

    it('Ignores JSX arguments to function calls used as return value of arrow functions', () => {
      let astNode = parseCode(`const obj = {
        prop: () => test(<a>something</a>)
      }`);
      let arrowFunctionExpression = astNode.declarations[0].init.properties[0].value;

      assert(!isReturningJSX(() => false, arrowFunctionExpression, mockContext));

      astNode = parseCode(`const obj = {
        prop: () => { return test(<a>something</a>); }
      }`);
      arrowFunctionExpression = astNode.declarations[0].init.properties[0].value;

      assert(!isReturningJSX(() => false, arrowFunctionExpression, mockContext));
    });
  });
});
