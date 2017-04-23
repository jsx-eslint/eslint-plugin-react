/**
 * @fileoverview Prevent usage of setState in componentWillUpdate
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-will-update-set-state');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-will-update-set-state', rule, {

  valid: [{
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentWillUpdate: function() {}',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentWillUpdate: function() {',
      '    someNonMemberFunction(arg);',
      '    this.someHandler = this.setState;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentWillUpdate: function() {',
      '    someClass.onSomeEvent(function(data) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    })',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentWillUpdate: function() {',
      '    function handleEvent(data) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    }',
      '    someClass.onSomeEvent(handleEvent)',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }],

  invalid: [{
    code: [
      'var Hello = createReactClass({',
      '  componentWillUpdate: function() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentWillUpdate() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentWillUpdate: function() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '});'
    ].join('\n'),
    options: ['disallow-in-func'],
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentWillUpdate() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentWillUpdate: function() {',
      '    someClass.onSomeEvent(function(data) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    })',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentWillUpdate() {',
      '    someClass.onSomeEvent(function(data) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    })',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentWillUpdate: function() {',
      '    if (true) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    }',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentWillUpdate() {',
      '    if (true) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    }',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentWillUpdate: function() {',
      '    someClass.onSomeEvent((data) => this.setState({data: data}));',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentWillUpdate() {',
      '    someClass.onSomeEvent((data) => this.setState({data: data}));',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentWillUpdate'
    }]
  }]
});
