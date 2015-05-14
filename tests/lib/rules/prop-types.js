/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var eslint = require('eslint').linter;
var ESLintTester = require('eslint-tester');

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var eslintTester = new ESLintTester(eslint);
eslintTester.addRuleTest('lib/rules/prop-types', {

  valid: [
    {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name.firstname}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Hello World {this.props.children}</div>;',
        '  }',
        '});'
      ].join('\n'),
      args: [1, {
        ignore: ['children']
      }],
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var props = this.props;',
        '    return <div>Hello World</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    var propName = "foo";',
        '    return <div>Hello World {this.props[propName]}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: externalPropTypes,',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello World</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};',
        'Hello.propTypes.lastname = React.PropTypes.string;'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.object.isRequired',
        '  },',
        '  render: function() {',
        '    var user = {',
        '      name: this.props.name',
        '    };',
        '    return <div>Hello {user.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      }
    }, {
      code: [
        'class Hello {',
        '  render() {',
        '    return \'Hello\' + this.props.name;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static get propTypes() {',
        '    return {',
        '      name: React.PropTypes.string',
        '    };',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { firstname, ...other } = this.props;',
        '    return <div>Hello {firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};'
      ].join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  static propTypes = {',
        '    name: React.PropTypes.string',
        '  }',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      parser: 'babel-eslint',
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      }
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  \'firstname\': React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      }
    }
  ],

  invalid: [
    {
      code: [
        'var Hello = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: '\'name\' is missing in props validation',
        line: 3,
        column: 34,
        type: 'Identifier'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'name\' is missing in props validation for Hello',
        line: 3,
        column: 34,
        type: 'Identifier'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.firstname} {this.props.lastname}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'lastname\' is missing in props validation for Hello'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  name: React.PropTypes.string',
        '};',
        'class HelloBis extends React.Component {',
        '  render() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '}'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        jsx: true
      },
      errors: [{
        message: '\'name\' is missing in props validation for HelloBis'
      }]
    }, {
      code: [
        'var Hello = React.createClass({',
        '  propTypes: {',
        '    name: React.PropTypes.string.isRequired',
        '  },',
        '  render: function() {',
        '    return <div>Hello {this.props.name} and {this.props.propWithoutTypeDefinition}</div>;',
        '  }',
        '});',
        'var Hello2 = React.createClass({',
        '  render: function() {',
        '    return <div>Hello {this.props.name}</div>;',
        '  }',
        '});'
      ].join('\n'),
      ecmaFeatures: {
        jsx: true
      },
      errors: [{
        message: '\'propWithoutTypeDefinition\' is missing in props validation'
      }, {
        message: '\'name\' is missing in props validation'
      }]
    }, {
      code: [
        'class Hello extends React.Component {',
        '  render() {',
        '    var { firstname, lastname } = this.props;',
        '    return <div>Hello</div>;',
        '  }',
        '}',
        'Hello.propTypes = {',
        '  firstname: React.PropTypes.string',
        '};'
      ].join('\n'),
      ecmaFeatures: {
        classes: true,
        destructuring: true,
        jsx: true
      },
      errors: [{
        message: '\'lastname\' is missing in props validation for Hello'
      }]
    }
  ]
});
