/**
 * @fileoverview Enforce style prop value is an object
 * @author David Petersen
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/style-prop-object');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('style-prop-object', rule, {
  valid: [
    {
      code: '<div style={{ color: "red" }} />',
      parserOptions: parserOptions
    },
    {
      code: '<Hello style={{ color: "red" }} />',
      parserOptions: parserOptions
    },
    {
      code: [
        'function redDiv() {',
        '  const styles = { color: "red" };',
        '  return <div style={styles} />;',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    },
    {
      code: [
        'function redDiv() {',
        '  const styles = { color: "red" };',
        '  return <Hello style={styles} />;',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    },
    {
      code: [
        'const styles = { color: "red" };',
        'function redDiv() {',
        '  return <div style={styles} />;',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    },
    {
      code: [
        'function redDiv(props) {',
        '  return <div style={props.styles} />;',
        '}'
      ].join('\n'),
      parserOptions: parserOptions
    },
    {
      code: [
        'import styles from \'./styles\';',
        'function redDiv() {',
        '  return <div style={styles} />;',
        '}'
      ].join('\n'),
      parserOptions: Object.assign({sourceType: 'module'}, parserOptions)
    },
    {
      code: [
        'import mystyles from \'./styles\';',
        'const styles = Object.assign({ color: \'red\' }, mystyles);',
        'function redDiv() {',
        '  return <div style={styles} />;',
        '}'
      ].join('\n'),
      parserOptions: Object.assign({sourceType: 'module'}, parserOptions)
    },
    {
      code: [
        'const otherProps = { style: { color: "red" } };',
        'const { a, b, ...props } = otherProps;',
        '<div {...props} />'
      ].join('\n'),
      parserOptions: parserOptions
    },
    {
      code: [
        'const styles = Object.assign({ color: \'red\' }, mystyles);',
        'React.createElement("div", { style: styles });'
      ].join('\n'),
      parserOptions: Object.assign({sourceType: 'module'}, parserOptions)
    },
    {
      code: '<div style></div>',
      parserOptions: parserOptions
    },
    {
      code: [
        'React.createElement(MyCustomElem, {',
        '  [style]: true',
        '}, \'My custom Elem\')'
      ].join('\n'),
      parserOptions: parserOptions
    }
  ],
  invalid: [
    {
      code: '<div style="color: \'red\'" />',
      errors: [{
        message: 'Style prop value must be an object',
        line: 1,
        column: 6,
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<Hello style="color: \'red\'" />',
      errors: [{
        message: 'Style prop value must be an object',
        line: 1,
        column: 8,
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: '<div style={true} />',
      errors: [{
        message: 'Style prop value must be an object',
        line: 1,
        column: 6,
        type: 'JSXAttribute'
      }],
      parserOptions: parserOptions
    },
    {
      code: [
        'const styles = \'color: "red"\';',
        'function redDiv2() {',
        '  return <div style={styles} />;',
        '}'
      ].join('\n'),
      errors: [{
        message: 'Style prop value must be an object',
        line: 3,
        column: 22,
        type: 'Identifier'
      }],
      parserOptions: parserOptions
    },
    {
      code: [
        'const styles = \'color: "red"\';',
        'function redDiv2() {',
        '  return <Hello style={styles} />;',
        '}'
      ].join('\n'),
      errors: [{
        message: 'Style prop value must be an object',
        line: 3,
        column: 24,
        type: 'Identifier'
      }],
      parserOptions: parserOptions
    },
    {
      code: [
        'const styles = true;',
        'function redDiv() {',
        '  return <div style={styles} />;',
        '}'
      ].join('\n'),
      errors: [{
        message: 'Style prop value must be an object',
        line: 3,
        column: 22,
        type: 'Identifier'
      }],
      parserOptions: parserOptions
    }
  ]
});
