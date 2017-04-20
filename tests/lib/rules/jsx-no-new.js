/**
 * @fileoverview Disallows instantiating classes in JSX attributes
 * @author Daniel Lo Nigro <dan.cx>
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-no-new');
var RuleTester = require('eslint').RuleTester;

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('jsx-no-new', rule, {

  valid: [
    {
      code: '<Foo />',
      parser: 'babel-eslint'
    },
    {
      code: '<Foo dummy={newDummy()} />',
      parser: 'babel-eslint'
    },
    {
      code: '<Foo dummy={newDummy()}></Foo>',
      parser: 'babel-eslint'
    },
    {
      code: '<Foo bar="hello" {...stuff} />',
      parser: 'babel-eslint'
    },
    {
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    return <Bar />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: '<Foo dummy={new Dummy()} />',
      parser: 'babel-eslint',
      errors: 1
    },
    {
      code: '<Foo dummy={new Dummy()}></Foo>',
      parser: 'babel-eslint',
      errors: 1
    },
    {
      code: [
        'class Foo extends React.Component {',
        '  render() {',
        '    return <Bar dummy={new Dummy()} />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      errors: 1
    }
  ]
});
