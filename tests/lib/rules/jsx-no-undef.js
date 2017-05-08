/**
 * @fileoverview Tests for jsx-no-undef
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

var eslint = require('eslint').linter;
var rule = require('../../../lib/rules/jsx-no-undef');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 8,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester({parserOptions});
eslint.defineRule('no-undef', require('eslint/lib/rules/no-undef'));
ruleTester.run('jsx-no-undef', rule, {
  valid: [{
    code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);'
  }, {
    code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);'
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<img />);'
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<x-gif />);'
  }, {
    code: '/*eslint no-undef:1*/ var React, app; React.render(<app.Foo />);'
  }, {
    code: '/*eslint no-undef:1*/ var React, app; React.render(<app.foo.Bar />);'
  }, {
    code: [
      '/*eslint no-undef:1*/',
      'var React;',
      'class Hello extends React.Component {',
      '  render() {',
      '    return <this.props.tag />',
      '  }',
      '}'
    ].join('\n')
  }, {
    code: 'var React; React.render(<Text />);',
    globals: {
      Text: true
    }
  }, {
    code: [
      'import Text from "cool-module";',
      'const TextWrapper = function (props) {',
      '  return (',
      '    <Text />',
      '  );',
      '};'
    ].join('\n'),
    parserOptions: Object.assign({sourceType: 'module'}, parserOptions),
    options: [{
      allowGlobals: false
    }],
    parser: 'babel-eslint'
  }],
  invalid: [{
    code: '/*eslint no-undef:1*/ var React; React.render(<App />);',
    errors: [{
      message: '\'App\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<Appp.Foo />);',
    errors: [{
      message: '\'Appp\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<Apppp:Foo />);',
    errors: [{
      message: '\'Apppp\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<appp.Foo />);',
    errors: [{
      message: '\'appp\' is not defined.'
    }]
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<appp.foo.Bar />);',
    errors: [{
      message: '\'appp\' is not defined.'
    }]
  }, {
    code: [
      'const TextWrapper = function (props) {',
      '  return (',
      '    <Text />',
      '  );',
      '};',
      'export default TextWrapper;'
    ].join('\n'),
    parserOptions: Object.assign({sourceType: 'module'}, parserOptions),
    errors: [{
      message: '\'Text\' is not defined.'
    }],
    options: [{
      allowGlobals: false
    }],
    parser: 'babel-eslint',
    globals: {
      Text: true
    }
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<Foo />);',
    errors: [{
      message: '\'Foo\' is not defined.'
    }]
  }]
});
