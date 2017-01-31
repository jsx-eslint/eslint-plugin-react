/**
 * @fileoverview Tests for forbid-foreign-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/forbid-foreign-prop-types');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ERROR_MESSAGE = 'Using another component\'s propTypes is forbidden';

var ruleTester = new RuleTester();
ruleTester.run('forbid-foreign-prop-types', rule, {

  valid: [{
    code: 'import { propTypes } from "SomeComponent";',
    parserOptions: parserOptions
  }, {
    code: 'import { propTypes as someComponentPropTypes } from "SomeComponent";',
    parserOptions: parserOptions
  }, {
    code: 'const foo = propTypes',
    parserOptions: parserOptions
  }, {
    code: 'foo(propTypes)',
    parserOptions: parserOptions
  }, {
    code: 'foo + propTypes',
    parserOptions: parserOptions
  }, {
    code: 'const foo = [propTypes]',
    parserOptions: parserOptions
  }, {
    code: 'const foo = { propTypes }',
    parserOptions: parserOptions
  }, {
    code: 'Foo.propTypes = propTypes',
    parserOptions: parserOptions
  }, {
    code: 'Foo["propTypes"] = propTypes',
    parserOptions: parserOptions
  }, {
    code: 'const propTypes = "bar"; Foo[propTypes];',
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'var Foo = React.createClass({',
      '  propTypes: Bar.propTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Identifier'
    }]
  },
  {
    code: [
      'var Foo = React.createClass({',
      '  propTypes: Bar["propTypes"],',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Literal'
    }]
  },
  {
    code: [
      'var { propTypes } = SomeComponent',
      'var Foo = React.createClass({',
      '  propTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Property'
    }]
  },
  {
    code: [
      'var { propTypes: things, ...foo } = SomeComponent',
      'var Foo = React.createClass({',
      '  propTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Property'
    }]
  },
  {
    code: [
      'class MyComponent extends React.Component {',
      '  static fooBar = {',
      '    baz: Qux.propTypes.baz',
      '  };',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Identifier'
    }]
  },
  {
    code: [
      'var { propTypes: typesOfProps } = SomeComponent',
      'var Foo = React.createClass({',
      '  propTypes: typesOfProps,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Property'
    }]
  }]
});
