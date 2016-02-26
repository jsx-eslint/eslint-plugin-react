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
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

var ruleTester = new RuleTester();
eslint.defineRule('no-undef', require('eslint/lib/rules/no-undef'));
ruleTester.run('jsx-no-undef', rule, {
  valid: [{
    code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);',
    parserOptions: parserOptions
  }, {
    code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);',
    parserOptions: parserOptions
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<img />);',
    parserOptions: parserOptions
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<x-gif />);',
    parserOptions: parserOptions
  }, {
    code: '/*eslint no-undef:1*/ var React, app; React.render(<app.Foo />);',
    parserOptions: parserOptions
  }, {
    code: '/*eslint no-undef:1*/ var React, app; React.render(<app.foo.Bar />);',
    parserOptions: parserOptions
  }],
  invalid: [{
    code: '/*eslint no-undef:1*/ var React; React.render(<App />);',
    errors: [{
      message: '\'App\' is not defined.'
    }],
    parserOptions: parserOptions
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<Appp.Foo />);',
    errors: [{
      message: '\'Appp\' is not defined.'
    }],
    parserOptions: parserOptions
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<Apppp:Foo />);',
    errors: [{
      message: '\'Apppp\' is not defined.'
    }],
    parserOptions: parserOptions
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<appp.Foo />);',
    errors: [{
      message: '\'appp\' is not defined.'
    }],
    parserOptions: parserOptions
  }, {
    code: '/*eslint no-undef:1*/ var React; React.render(<appp.foo.Bar />);',
    errors: [{
      message: '\'appp\' is not defined.'
    }],
    parserOptions: parserOptions
  }]
});
