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
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ERROR_MESSAGE = 'Using another component\'s propTypes is forbidden';

var ruleTester = new RuleTester({parserOptions});
ruleTester.run('forbid-foreign-prop-types', rule, {

  valid: [{
    code: 'import { propTypes } from "SomeComponent";'
  }, {
    code: 'import { propTypes as someComponentPropTypes } from "SomeComponent";'
  }, {
    code: 'const foo = propTypes'
  }, {
    code: 'foo(propTypes)'
  }, {
    code: 'foo + propTypes'
  }, {
    code: 'const foo = [propTypes]'
  }, {
    code: 'const foo = { propTypes }'
  }, {
    code: 'Foo.propTypes = propTypes'
  }, {
    code: 'Foo["propTypes"] = propTypes'
  }, {
    code: 'const propTypes = "bar"; Foo[propTypes];'
  }],

  invalid: [{
    code: [
      'var Foo = createReactClass({',
      '  propTypes: Bar.propTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Identifier'
    }]
  },
  {
    code: [
      'var Foo = createReactClass({',
      '  propTypes: Bar["propTypes"],',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Literal'
    }]
  },
  {
    code: [
      'var { propTypes } = SomeComponent',
      'var Foo = createReactClass({',
      '  propTypes,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Property'
    }]
  },
  {
    code: [
      'var { propTypes: things, ...foo } = SomeComponent',
      'var Foo = createReactClass({',
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
      'var Foo = createReactClass({',
      '  propTypes: typesOfProps,',
      '  render: function() {',
      '    return <Foo className="bar" />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Property'
    }]
  }]
});
