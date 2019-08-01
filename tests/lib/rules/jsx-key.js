/**
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-key');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const settings = {
  react: {
    pragma: 'Act',
    fragment: 'Frag'
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-key', rule, {
  valid: [
    {code: 'fn()'},
    {code: '[1, 2, 3].map(function () {})'},
    {code: '<App />;'},
    {code: '[<App key={0} />, <App key={1} />];'},
    {code: '[1, 2, 3].map(function(x) { return <App key={x} /> });'},
    {code: '[1, 2, 3].map(x => <App key={x} />);'},
    {code: '[1, 2, 3].map(x => { return <App key={x} /> });'},
    {code: '[1, 2, 3].foo(x => <App />);'},
    {code: 'var App = () => <div />;'},
    {code: '[1, 2, 3].map(function(x) { return; });'},
    {code: 'foo(() => <div />);'},
    {code: 'foo(() => <></>);', parser: parsers.BABEL_ESLINT},
    {code: '<></>;', parser: parsers.BABEL_ESLINT}
  ],
  invalid: [{
    code: '[<App />];',
    errors: [{message: 'Missing "key" prop for element in array'}]
  }, {
    code: '[<App {...key} />];',
    errors: [{message: 'Missing "key" prop for element in array'}]
  }, {
    code: '[<App key={0}/>, <App />];',
    errors: [{message: 'Missing "key" prop for element in array'}]
  }, {
    code: '[1, 2 ,3].map(function(x) { return <App /> });',
    errors: [{message: 'Missing "key" prop for element in iterator'}]
  }, {
    code: '[1, 2 ,3].map(x => <App />);',
    errors: [{message: 'Missing "key" prop for element in iterator'}]
  }, {
    code: '[1, 2 ,3].map(x => { return <App /> });',
    errors: [{message: 'Missing "key" prop for element in iterator'}]
  }, {
    code: '[1, 2, 3].map(x => <>{x}</>);',
    parser: parsers.BABEL_ESLINT,
    options: [{checkFragmentShorthand: true}],
    settings,
    errors: [{message: 'Missing "key" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use Act.Frag instead'}]
  }, {
    code: '[<></>];',
    parser: parsers.BABEL_ESLINT,
    options: [{checkFragmentShorthand: true}],
    settings,
    errors: [{message: 'Missing "key" prop for element in array. Shorthand fragment syntax does not support providing keys. Use Act.Frag instead'}]
  }]
});
