/**
 * @fileoverview Enforce style prop value is an object
 * @author David Petersen
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/style-prop-object');
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
ruleTester.run('style-prop-object', rule, {
  valid: [
    {
      code: '<div style={{ color: "red" }} />'
    },
    {
      code: '<Hello style={{ color: "red" }} />'
    },
    {
      code: [
        'function redDiv() {',
        '  const styles = { color: "red" };',
        '  return <div style={styles} />;',
        '}'
      ].join('\n')
    },
    {
      code: [
        'function redDiv() {',
        '  const styles = { color: "red" };',
        '  return <Hello style={styles} />;',
        '}'
      ].join('\n')
    },
    {
      code: [
        'const styles = { color: "red" };',
        'function redDiv() {',
        '  return <div style={styles} />;',
        '}'
      ].join('\n')
    },
    {
      code: [
        'function redDiv(props) {',
        '  return <div style={props.styles} />;',
        '}'
      ].join('\n')
    },
    {
      code: [
        'import styles from \'./styles\';',
        'function redDiv() {',
        '  return <div style={styles} />;',
        '}'
      ].join('\n')
    },
    {
      code: [
        'import mystyles from \'./styles\';',
        'const styles = Object.assign({ color: \'red\' }, mystyles);',
        'function redDiv() {',
        '  return <div style={styles} />;',
        '}'
      ].join('\n'),
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    {
      code: [
        'const otherProps = { style: { color: "red" } };',
        'const { a, b, ...props } = otherProps;',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: [
        'const styles = Object.assign({ color: \'red\' }, mystyles);',
        'React.createElement("div", { style: styles });'
      ].join('\n'),
      parserOptions: Object.assign({sourceType: 'module'}, parserOptions)
    },
    {
      code: '<div style></div>'
    },
    {
      code: [
        'React.createElement(MyCustomElem, {',
        '  [style]: true',
        '}, \'My custom Elem\')'
      ].join('\n')
    },
    {
      code: [
        'let style;',
        '<div style={style}></div>'
      ].join('\n')
    },
    {
      code: [
        'let style = null;',
        '<div style={style}></div>'
      ].join('\n')
    },
    {
      code: [
        'let style = undefined;',
        '<div style={style}></div>'
      ].join('\n')
    },
    {
      code: '<div style={undefined}></div>'
    },
    {
      code: [
        'const props = { style: undefined };',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: [
        'const otherProps = { style: undefined };',
        'const { a, b, ...props } = otherProps;',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: [
        'React.createElement("div", {',
        '  style: undefined',
        '})'
      ].join('\n')
    },
    {
      code: [
        'let style;',
        'React.createElement("div", {',
        '  style',
        '})'
      ].join('\n')
    },
    {
      code: '<div style={null}></div>'
    },
    {
      code: [
        'const props = { style: null };',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: [
        'const otherProps = { style: null };',
        'const { a, b, ...props } = otherProps;',
        '<div {...props} />'
      ].join('\n')
    },
    {
      code: [
        'React.createElement("div", {',
        '  style: null',
        '})'
      ].join('\n')
    },
    {
      code: [
        'const MyComponent = (props) => {',
        '  React.createElement(MyCustomElem, {',
        '    ...props',
        '  });',
        '};'
      ].join('\n')
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
      }]
    },
    {
      code: '<Hello style="color: \'red\'" />',
      errors: [{
        message: 'Style prop value must be an object',
        line: 1,
        column: 8,
        type: 'JSXAttribute'
      }]
    },
    {
      code: '<div style={true} />',
      errors: [{
        message: 'Style prop value must be an object',
        line: 1,
        column: 6,
        type: 'JSXAttribute'
      }]
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
      }]
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
      }]
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
      }]
    }
  ]
});
