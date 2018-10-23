/**
 * @fileoverview Tests for no-update-forcing-props
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-update-forcing-props');
const RuleTester = require('eslint').RuleTester;

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

ruleTester.run('no-update-forcing-props', rule, {
  valid: [
    {code: '<App foo />;'},
    {code: '<App foo={true} />;'},
    {code: '<App foo={1} />;'},
    {code: '<App foo="bar" />;'},
    {code: 'var bar = {}; <App foo={bar} />;'},
    {code: 'var bar = []; <App foo={bar} />;'},
    {code: 'function bar() {}; <App foo={bar} />;'},
    {code: 'var bar = () => {}; <App foo={bar} />;'},
    {code: 'var bar = new Date(); <App foo={bar} />;'},
    {code: 'var bar = Symbol(\'\'); <App foo={bar} />;'}
  ],
  invalid: [
    {
      code: '<App foo={{}} />',
      errors: [{message: 'Objects must be defined outside attributes to avoid unnecessary updates.'}]
    },
    {
      code: '<App foo={[]} />',
      errors: [{message: 'Arrays must be defined outside attributes to avoid unnecessary updates.'}]
    },
    {
      code: '<App foo={function() {}} />',
      errors: [{message: 'Functions must be defined outside attributes to avoid unnecessary updates.'}]
    },
    {
      code: '<App foo={() => {}} />',
      errors: [{message: 'Functions must be defined outside attributes to avoid unnecessary updates.'}]
    },
    {
      code: '<App foo={new Date()} />',
      errors: [{message: 'Constructor expressions must be defined outside attributes to avoid unnecessary updates.'}]
    },
    {
      code: '<App foo={Symbol(\'\')} />',
      errors: [{message: 'Function calls must be defined outside attributes to avoid unnecessary updates.'}]
    }
  ]
});
