/**
 * @fileoverview Prevent usage of setState in componentDidUpdate
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-did-update-set-state');
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
ruleTester.run('no-did-update-set-state', rule, {

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
      '  componentDidUpdate: function() {}',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidUpdate: function() {',
      '    someNonMemberFunction(arg);',
      '    this.someHandler = this.setState;',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidUpdate: function() {',
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
      '  componentDidUpdate: function() {',
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
      '  componentDidUpdate: function() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '});'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentDidUpdate() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidUpdate: function() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '});'
    ].join('\n'),
    options: ['disallow-in-func'],
    parserOptions: parserOptions,
    errors: [{
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentDidUpdate() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidUpdate: function() {',
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
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentDidUpdate() {',
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
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidUpdate: function() {',
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
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentDidUpdate() {',
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
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  componentDidUpdate: function() {',
      '    someClass.onSomeEvent((data) => this.setState({data: data}));',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentDidUpdate() {',
      '    someClass.onSomeEvent((data) => this.setState({data: data}));',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: ['disallow-in-func'],
    errors: [{
      message: 'Do not use setState in componentDidUpdate'
    }]
  }]
});
