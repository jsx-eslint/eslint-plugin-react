/**
 * @fileoverview Tests for jsx-uses-react
 * @author Glen Mailer
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const eslint = require('eslint');
const rule = require('eslint/lib/rules/no-unused-vars');
const RuleTester = eslint.RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
const linter = ruleTester.linter || eslint.linter;
linter.defineRule('jsx-uses-react', require('../../../lib/rules/jsx-uses-react'));
ruleTester.run('no-unused-vars', rule, {
  valid: [
    {code: '/*eslint jsx-uses-react:1*/ var React; <div />;'},
    {code: '/*eslint jsx-uses-react:1*/ var React; (function () { <div /> })();'},
    {
      code: '/*eslint jsx-uses-react:1*/ var React; <></>;',
      parser: 'babel-eslint'
    },
    {code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var Foo; <div />;'},
    {
      code: '/*eslint jsx-uses-react:1*/ /** @jsxFrag Foo.Fragment */ var Foo; <></>;',
      parser: 'babel-eslint'
    },
    {
      code: '/*eslint jsx-uses-react:1*/ var Foo; <div />;',
      settings: {
        react: {
          jsxPragma: 'Foo'
        }
      }
    },
    {
      code: '/*eslint jsx-uses-react:1*/ var React; <></>;',
      parser: 'babel-eslint',
      settings: {
        react: {
          jsxPragma: 'Foo'
        }
      }
    },
    {
      code: '/*eslint jsx-uses-react:1*/ var Foo; <></>;',
      parser: 'babel-eslint',
      settings: {
        react: {
          jsxFragPragma: 'Foo'
        }
      }
    },
    {
      code: '/*eslint jsx-uses-react:1*/ var Foo; var Bar; <><div /></>;',
      parser: 'babel-eslint',
      settings: {
        react: {
          jsxPragma: 'Foo',
          jsxFragPragma: 'Bar'
        }
      }
    },
    // Cases for deprecated settings
    {
      code: '/*eslint jsx-uses-react:1*/ var Foo; <div />;',
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    },
    {
      code: '/*eslint jsx-uses-react:1*/ var Foo; <></>;',
      parser: 'babel-eslint',
      settings: {
        react: {
          pragma: 'Foo'
        }
      }
    }
  ],
  invalid: [
    {
      code: '/*eslint jsx-uses-react:1*/ var React;',
      errors: [{message: '\'React\' is defined but never used.'}]
    },
    {
      code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var React; <div />;',
      errors: [{message: '\'React\' is defined but never used.'}]
    },
    {
      code: '/*eslint jsx-uses-react:1*/ /** @jsxFrag Foo.Fragment */ var Foo; <div />;',
      parser: 'babel-eslint',
      errors: [{message: '\'Foo\' is defined but never used.'}]
    },
    {
      code: '/*eslint jsx-uses-react:1*/ /** @jsxFrag Foo.Fragment */ var React; <></>;',
      parser: 'babel-eslint',
      errors: [{message: '\'React\' is defined but never used.'}]
    },
    {
      code: '/*eslint jsx-uses-react:1*/ /** @jsx Foo */ var Foo; <></>;',
      parser: 'babel-eslint',
      errors: [{message: '\'Foo\' is defined but never used.'}]
    },
    {
      code: '/*eslint jsx-uses-react:1*/ var React; <div />;',
      errors: [{message: '\'React\' is defined but never used.'}],
      settings: {
        react: {
          jsxPragma: 'Foo'
        }
      }
    },
    {
      code: '/*eslint jsx-uses-react:1*/ var Foo; <div />;',
      parser: 'babel-eslint',
      errors: [{message: '\'Foo\' is defined but never used.'}],
      settings: {
        react: {
          jsxFragPragma: 'Foo'
        }
      }
    },
    {
      code: '/*eslint jsx-uses-react:1*/ var React; <></>;',
      parser: 'babel-eslint',
      errors: [{message: '\'React\' is defined but never used.'}],
      settings: {
        react: {
          jsxFragPragma: 'Foo'
        }
      }
    },
    {
      code: '/*eslint jsx-uses-react:1*/ var Foo; <></>;',
      parser: 'babel-eslint',
      errors: [{message: '\'Foo\' is defined but never used.'}],
      settings: {
        react: {
          jsxPragma: 'Foo'
        }
      }
    }
  ]
});
