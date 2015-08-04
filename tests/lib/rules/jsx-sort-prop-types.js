/**
 * @fileoverview Tests for jsx-sort-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/jsx-sort-prop-types');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ERROR_MESSAGE = 'Prop types declarations should be sorted alphabetically';

var ruleTester = new RuleTester();
ruleTester.run('jsx-sort-prop-types', rule, {
  valid: [
    {
      code: [
        'var First = React.createClass({',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var First = React.createClass({',
        '  propTypes: externalPropTypes,',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var First = React.createClass({',
        '  propTypes: {',
        '    A: React.PropTypes.any,',
        '    Z: React.PropTypes.string,',
        '    a: React.PropTypes.any,',
        '    z: React.PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var First = React.createClass({',
        '  propTypes: {',
        '    a: React.PropTypes.any,',
        '    A: React.PropTypes.any,',
        '    z: React.PropTypes.string,',
        '    Z: React.PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      options: [{
        ignoreCase: true
      }],
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var First = React.createClass({',
        '  propTypes: {',
        '    a: React.PropTypes.any,',
        '    z: React.PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});',
        'var Second = React.createClass({',
        '  propTypes: {',
        '    AA: React.PropTypes.any,',
        '    ZZ: React.PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'class First extends React.Component {',
        '  render() {',
        '    return <div />;',
        '  }',
        '}',
        'First.propTypes = {',
        '  a: React.PropTypes.string,',
        '  z: React.PropTypes.string',
        '};',
        'First.propTypes.justforcheck = React.PropTypes.string;'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class First extends React.Component {',
        '  render() {',
        '    return <div />;',
        '  }',
        '}',
        'First.propTypes = {',
        '  a: React.PropTypes.any,',
        '  A: React.PropTypes.any,',
        '  z: React.PropTypes.string,',
        '  Z: React.PropTypes.string',
        '};'
      ].join('\n'),
      options: [{
        ignoreCase: true
      }],
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Component extends React.Component {',
        '  static propTypes = {',
        '    a: React.PropTypes.any,',
        '    b: React.PropTypes.any,',
        '    c: React.PropTypes.any',
        '  }',
        '  render() {',
        '    return <div />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  "aria-controls": React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      options: [{
        ignoreCase: true
      }]
    }, {
      // Invalid code, should not be validated
      code: [
        'class Component extends React.Component {',
        '  propTypes: {',
        '    a: React.PropTypes.any,',
        '    c: React.PropTypes.any,',
        '    b: React.PropTypes.any',
        '  }',
        '  render() {',
        '    return <div />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: [
        'var First = React.createClass({',
        '  propTypes: {',
        '    z: React.PropTypes.string,',
        '    a: React.PropTypes.any',
        '  },',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: ERROR_MESSAGE,
        line: 4,
        column: 5,
        type: 'Property'
      }]
    }, {
      code: [
        'var First = React.createClass({',
        '  propTypes: {',
        '    z: React.PropTypes.any,',
        '    Z: React.PropTypes.any',
        '  },',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: ERROR_MESSAGE,
        line: 4,
        column: 5,
        type: 'Property'
      }]
    }, {
      code: [
        'var First = React.createClass({',
        '  propTypes: {',
        '    Z: React.PropTypes.any,',
        '    a: React.PropTypes.any',
        '  },',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      options: [{
        ignoreCase: true
      }],
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: ERROR_MESSAGE,
        line: 4,
        column: 5,
        type: 'Property'
      }]
    }, {
      code: [
        'var First = React.createClass({',
        '  propTypes: {',
        '    a: React.PropTypes.any,',
        '    A: React.PropTypes.any,',
        '    z: React.PropTypes.string,',
        '    Z: React.PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      },
      errors: 2
    }, {
      code: [
        'var First = React.createClass({',
        '  propTypes: {',
        '    a: React.PropTypes.any,',
        '    Zz: React.PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});',
        'var Second = React.createClass({',
        '  propTypes: {',
        '    aAA: React.PropTypes.any,',
        '    ZZ: React.PropTypes.string',
        '  },',
        '  render: function() {',
        '    return <div />;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      },
      errors: 2
    }, {
      code: [
        'class First extends React.Component {',
        '  render() {',
        '    return <div />;',
        '  }',
        '}',
        'First.propTypes = {',
        '    yy: React.PropTypes.any,',
        '    bb: React.PropTypes.string',
        '};',
        'class Second extends React.Component {',
        '  render() {',
        '    return <div />;',
        '  }',
        '}',
        'Second.propTypes = {',
        '    aAA: React.PropTypes.any,',
        '    ZZ: React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: 2
    }, {
      code: [
        'class Component extends React.Component {',
        '  static propTypes = {',
        '    z: React.PropTypes.any,',
        '    y: React.PropTypes.any,',
        '    a: React.PropTypes.any',
        '  }',
        '  render() {',
        '    return <div />;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: 2
    }
  ]
});
