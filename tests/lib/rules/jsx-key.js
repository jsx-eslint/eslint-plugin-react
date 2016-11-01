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

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-key', rule, {
  valid: [
    {code: 'fn()', parserOptions: parserOptions},
    {code: '[1, 2, 3].map(function () {})', parserOptions: parserOptions},
    {code: '<App />;', parserOptions: parserOptions},
    {code: '[<App key={0} />, <App key={1} />];', parserOptions: parserOptions},
    {code: '[1, 2, 3].map(function(x) { return <App key={x} /> });', parserOptions: parserOptions},
    {code: '[1, 2, 3].map(x => <App key={x} />);', parserOptions: parserOptions},
    {code: '[1, 2, 3].map(x => { return <App key={x} /> });', parserOptions: parserOptions},
    {code: '[1, 2, 3].foo(x => <App />);', parserOptions: parserOptions},
    {code: 'var App = () => <div />;', parserOptions: parserOptions},
    {code: '[1, 2, 3].map(function(x) { return; });', parserOptions: parserOptions},
    {code: 'foo(() => <div />);', parserOptions: parserOptions}
  ],
  invalid: [{
    code: '[<App />];',
    errors: [{message: 'Missing "key" prop for element in array'}],
    parserOptions: parserOptions
  }, {
    code: '[<App {...key} />];',
    errors: [{message: 'Missing "key" prop for element in array'}],
    parserOptions: parserOptions
  }, {
    code: '[<App key={0}/>, <App />];',
    errors: [{message: 'Missing "key" prop for element in array'}],
    parserOptions: parserOptions
  }, {
    code: '[1, 2 ,3].map(function(x) { return <App /> });',
    errors: [{message: 'Missing "key" prop for element in iterator'}],
    parserOptions: parserOptions
  }, {
    code: '[1, 2 ,3].map(x => <App />);',
    errors: [{message: 'Missing "key" prop for element in iterator'}],
    parserOptions: parserOptions
  }, {
    code: '[1, 2 ,3].map(x => { return <App /> });',
    errors: [{message: 'Missing "key" prop for element in iterator'}],
    parserOptions: parserOptions
  }]
});
