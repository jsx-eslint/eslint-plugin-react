/**
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-key');
var RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-key', rule, {
  valid: [
    {code: '<App />;', ecmaFeatures: {jsx: true}},
    {code: '[<App key={0} />, <App key={1} />];', ecmaFeatures: {jsx: true}},
    {code: '[1, 2, 3].map(x => <App key={x} />);', ecmaFeatures: {jsx: true, arrowFunctions: true}}
  ],
  invalid: [
    {code: '[<App />];',
     errors: [{message: 'Missing "key" prop for element in array'}],
     ecmaFeatures: {jsx: true}},

    {code: '[<App {...key} />];',
     errors: [{message: 'Missing "key" prop for element in array'}],
     ecmaFeatures: {jsx: true}},

    {code: '[<App key={0}/>, <App />];',
     errors: [{message: 'Missing "key" prop for element in array'}],
     ecmaFeatures: {jsx: true}},

    {code: '[1, 2 ,3].map(x => <App />);',
     errors: [{message: 'Missing "key" prop for element in iterator'}],
     ecmaFeatures: {jsx: true, arrowFunctions: true}}
  ]
});
