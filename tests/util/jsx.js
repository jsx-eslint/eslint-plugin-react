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

const mockContext = {
  getSourceCode() { return { getScope: mockContext.getScope }; },
  getScope() {
    return {
      type: 'global',
      upper: null,
      childScopes: [],
      variables: [],
    };
  },
};

describe('jsxUtil', () => {
  describe('isReturningJSX', () => {
    const assertValid = (codeStr) => assert(
      isReturningJSX(mockContext, parseCode(codeStr))
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

  describe('isLineBreak', () => {
    const getChildren = (code) => espree.parse(code, Object.assign({}, DEFAULT_CONFIG, { loc: true })).body[0].expression.children;

    it('is true for whitespace that spans lines', () => {
      const children = getChildren('<div>\n  {a}\n</div>');
      assert.deepStrictEqual(children.map(jsxUtil.isLineBreak), [true, false, true]);
    });

    it('is false for whitespace on one line', () => {
      const children = getChildren('<div> {a}</div>');
      assert.deepStrictEqual(children.map(jsxUtil.isLineBreak), [false, false]);
    });

    it('is false for text that spans lines', () => {
      const children = getChildren('<div>\n  text\n</div>');
      assert.deepStrictEqual(children.map(jsxUtil.isLineBreak), [false]);
    });

    it('is false for elements', () => {
      const children = getChildren('<div><span /></div>');
      assert.deepStrictEqual(children.map(jsxUtil.isLineBreak), [false]);
    });
  });
});
