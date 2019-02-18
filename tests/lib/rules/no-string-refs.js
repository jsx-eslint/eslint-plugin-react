/**
 * @fileoverview Prevent string definitions for references and prevent referencing this.refs
 * @author Tom Hastjarjanto
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-string-refs');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-refs', rule, {

  valid: [{
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
           var component = this.hello;
        },
        render: function() {
          return <div ref={c => this.hello = c}>Hello {this.props.name}</div>;
        }
      });
    `,
    parser: 'babel-eslint'
  },
  {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div ref={`hello`}>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint'
  },
  {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    return <div ref={`hello${index}`}>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint'
  }
  ],

  invalid: [{
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
           var component = this.refs.hello;
        },
        render: function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    parser: 'babel-eslint',
    errors: [{
      message: 'Using this.refs is deprecated.'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        render: function() {
          return <div ref="hello">Hello {this.props.name}</div>;
        }
      });
    `,
    parser: 'babel-eslint',
    errors: [{
      message: 'Using string literals in ref attributes is deprecated.'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        render: function() {
          return <div ref={'hello'}>Hello {this.props.name}</div>;
        }
      });
    `,
    parser: 'babel-eslint',
    errors: [{
      message: 'Using string literals in ref attributes is deprecated.'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        componentDidMount: function() {
           var component = this.refs.hello;
        },
        render: function() {
          return <div ref="hello">Hello {this.props.name}</div>;
        }
      });
    `,
    parser: 'babel-eslint',
    errors: [{
      message: 'Using this.refs is deprecated.'
    }, {
      message: 'Using string literals in ref attributes is deprecated.'
    }]
  },
  {
    code: [
      'var Hello = createReactClass({',
      '  componentDidMount: function() {',
      '  var component = this.refs.hello;',
      '  },',
      '  render: function() {',
      '    return <div ref={`hello`}>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{noTemplateLiterals: true}],
    errors: [{
      message: 'Using this.refs is deprecated.'
    }, {
      message: 'Using string literals in ref attributes is deprecated.'
    }]
  },
  {
    code: [
      'var Hello = createReactClass({',
      '  componentDidMount: function() {',
      '  var component = this.refs.hello;',
      '  },',
      '  render: function() {',
      '    return <div ref={`hello${index}`}>Hello {this.props.name}</div>;',
      '  }',
      '});'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{noTemplateLiterals: true}],
    errors: [{
      message: 'Using this.refs is deprecated.'
    }, {
      message: 'Using string literals in ref attributes is deprecated.'
    }]
  }]
});
