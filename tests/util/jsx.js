'use strict';

const assert = require('assert');
const espree = require('espree');

const jsxUtil = require('../../lib/util/jsx');

const isReturningJSX = jsxUtil.isReturningJSX;

const DEFAULT_CONFIG = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

const parseCode = (code) => {
  const ASTnode = espree.parse(code, DEFAULT_CONFIG);
  // Return only first statement
  return ASTnode.body[0];
};

describe('jsxUtil', () => {
  describe('isReturningJSX', () => {
    const assertValid = (codeStr) => assert(
      isReturningJSX(() => false, parseCode(codeStr))
    );
    const assertInValid = (codeStr) => assert(
      !!isReturningJSX(() => false, parseCode(codeStr))
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
      assertInValid(`
        function Test() {
          return null;
        }
      `);
    });
  });
});
