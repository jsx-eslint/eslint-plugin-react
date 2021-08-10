/**
 * @fileoverview Tests for jsx-no-update-forcing-props
 * @author Wojciech Maj
 */

'use strict';

const eslint = require('eslint');
const rule = require('../../../lib/rules/jsx-no-update-forcing-props');

const RuleTester = eslint.RuleTester;

const parsers = require('../../helpers/parsers');

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

ruleTester.run('jsx-no-update-forcing-props', rule, {
  valid: [
    {code: '<App foo />;'},
    {
      code: '<App foo />;',
      parser: parsers.BABEL_ESLINT
    },
    {code: '<App foo={true} />;'},
    {code: '<App foo={1} />;'},
    {code: '<App foo="bar" />;'},
    {code: 'var bar = {}; <App foo={bar} />;'},
    {code: 'var bar = []; <App foo={bar} />;'},
    {code: 'function bar() {}; <App foo={bar} />;'},
    {code: 'var bar = () => {}; <App foo={bar} />;'},
    {code: 'var bar = new Date(); <App foo={bar} />;'},
    {code: 'var bar = Symbol(\'\'); <App foo={bar} />;'},

    // object expressions explicitly allowed
    {
      code: '<App ref={{}} />',
      options: [{objectExpressions: true}]
    },

    // array expressions explicitly allowed
    {
      code: '<App ref={[]} />',
      options: [{arrayExpressions: true}]
    },

    // function expressions explicitly allowed
    {
      code: '<App ref={function() {}} />',
      options: [{functionExpressions: true}]
    },

    // arrow function expressions explicitly allowed
    {
      code: '<App ref={() => {}} />',
      options: [{arrowFunctionExpressions: true}]
    },

    // new expressions explicitly allowed
    {
      code: '<App ref={new Date()} />',
      options: [{newExpressions: true}]
    },

    // call expressions explicitly allowed
    {
      code: '<App ref={Symbol(\'\')} />',
      options: [{callExpressions: true}]
    },

    // ref explicitly ignored
    {
      code: '<App ref={c => this._input = c} />',
      options: [{ignoreRefs: true}]
    },

    // ignore DOM components
    {
      code: '<div foo={{}} />'
    },
    {
      code: '<div foo={[]} />'
    },
    {
      code: '<div foo={function() {}} />'
    },
    {
      code: '<div foo={() => {}} />'
    },
    {
      code: '<div foo={new Date()} />'
    },
    {
      code: '<div foo={Symbol(\'\')} />'
    }
  ],
  invalid: [
    {
      code: '<App foo={{}} />',
      errors: [{message: 'Objects must be defined outside render function to avoid unnecessary component rerenders.'}]
    },
    {
      code: '<App foo={{}} />',
      parser: parsers.BABEL_ESLINT,
      errors: [{message: 'Objects must be defined outside render function to avoid unnecessary component rerenders.'}]
    },
    {
      code: '<App foo={[]} />',
      errors: [{message: 'Arrays must be defined outside render function to avoid unnecessary component rerenders.'}]
    },
    {
      code: '<App foo={function() {}} />',
      errors: [{message: 'Functions must be defined outside render function to avoid unnecessary component rerenders.'}]
    },
    {
      code: '<App foo={() => {}} />',
      errors: [{message: 'Functions must be defined outside render function to avoid unnecessary component rerenders.'}]
    },
    {
      code: '<App foo={new Date()} />',
      errors: [{message: 'Constructor expressions must be defined outside render function to avoid unnecessary component rerenders.'}]
    },
    {
      code: '<App foo={Symbol(\'\')} />',
      errors: [{message: 'Function calls must be defined outside render function to avoid unnecessary component rerenders.'}]
    }
  ]
});
