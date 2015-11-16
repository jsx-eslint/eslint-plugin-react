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

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-did-update-set-state', rule, {

  valid: [{
    code: [
      'var Hello = React.createClass({',
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
      '  componentDidUpdate: function() {}',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var Hello = React.createClass({',
      '  componentDidUpdate: function() {',
      '    someNonMemberFunction(arg);',
      '    this.someHandler = this.setState;',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var Hello = React.createClass({',
      '  componentDidUpdate: function() {',
      '    someClass.onSomeEvent(function(data) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    })',
      '  }',
      '});'
    ].join('\n'),
    options: ['allow-in-func'],
    ecmaFeatures: {
      jsx: true
    }
  }, {
    code: [
      'var Hello = React.createClass({',
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
    options: ['allow-in-func'],
    ecmaFeatures: {
      jsx: true
    }
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  componentDidUpdate: function() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
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
      'var Hello = React.createClass({',
      '  componentDidUpdate: function() {',
      '    this.setState({',
      '      data: data',
      '    });',
      '  }',
      '});'
    ].join('\n'),
    options: ['allow-in-func'],
    ecmaFeatures: {
      jsx: true
    },
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
    options: ['allow-in-func'],
    errors: [{
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  componentDidUpdate: function() {',
      '    someClass.onSomeEvent(function(data) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    })',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
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
    errors: [{
      message: 'Do not use setState in componentDidUpdate'
    }]
  }, {
    code: [
      'var Hello = React.createClass({',
      '  componentDidUpdate: function() {',
      '    if (true) {',
      '      this.setState({',
      '        data: data',
      '      });',
      '    }',
      '  }',
      '});'
    ].join('\n'),
    ecmaFeatures: {
      jsx: true
    },
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
      'var Hello = React.createClass({',
      '  componentDidUpdate: function() {',
      '    someClass.onSomeEvent((data) => this.setState({data: data}));',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    ecmaFeatures: {
      jsx: true
    },
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
    errors: [{
      message: 'Do not use setState in componentDidUpdate'
    }]
  }]
});
