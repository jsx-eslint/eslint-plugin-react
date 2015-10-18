/**
 * @fileoverview Tests for forbid-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var rule = require('../../../lib/rules/forbid-prop-types');
var RuleTester = require('eslint').RuleTester;

require('babel-eslint');

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ANY_ERROR_MESSAGE = 'Prop type `any` is forbidden';
var ARRAY_ERROR_MESSAGE = 'Prop type `array` is forbidden';
var NUMBER_ERROR_MESSAGE = 'Prop type `number` is forbidden';
var OBJECT_ERROR_MESSAGE = 'Prop type `object` is forbidden';

var ruleTester = new RuleTester();
ruleTester.run('forbid-prop-types', rule, {

  valid: [{
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
      '    s: React.PropTypes.string,',
      '    n: React.PropTypes.number,',
      '    i: React.PropTypes.instanceOf,',
      '    b: React.PropTypes.bool',
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
      '    a: React.PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'object']
    }],
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    o: React.PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array']
    }],
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    o: React.PropTypes.object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array']
    }],
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
      '  b: React.PropTypes.string',
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
      '  elem: PropTypes.instanceOf(HTMLElement)',
      '};'
    ].join('\n'),
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
    parser: 'babel-eslint'
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
  }, {
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    let { a, ...b } = obj;',
      '    let c = { ...d };',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    env: {
      es6: true
    },
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  }, {
    code: [
      'var Hello = React.createClass({',
      '  propTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }],

  invalid: [{
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
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
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    n: React.PropTypes.number',
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
      message: NUMBER_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }],
    options: [{
      forbid: ['number']
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.any.isRequired',
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
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.array',
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
      message: ARRAY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.array.isRequired',
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
      message: ARRAY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.object',
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
      message: OBJECT_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.object.isRequired',
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
      message: OBJECT_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.array,',
      '    o: React.PropTypes.object',
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
      '    s: React.PropTypes.shape({,',
      '      o: React.PropTypes.object',
      '    })',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    errors: 1
  }, {
    code: [
      'var First = React.createClass({',
      '  propTypes: {',
      '    a: React.PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = React.createClass({',
      '  propTypes: {',
      '    o: React.PropTypes.object',
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
      '    a: React.PropTypes.array,',
      '    o: React.PropTypes.object',
      '};',
      'class Second extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Second.propTypes = {',
      '    a: React.PropTypes.array,',
      '    o: React.PropTypes.object',
      '};'
    ].join('\n'),
    ecmaFeatures: {
      classes: true,
      jsx: true
    },
    errors: 4
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: React.PropTypes.array,',
      '    o: React.PropTypes.object',
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
  }, {
    code: [
      'var Hello = React.createClass({',
      '  propTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    options: [{
      forbid: ['instanceOf']
    }],
    errors: 1
  }, {
    code: [
      'var object = React.PropTypes.object;',
      'var Hello = React.createClass({',
      '  propTypes: {',
      '    retailer: object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
    options: [{
      forbid: ['object']
    }],
    errors: 1
  }]
});
