'use strict';

const rule = require('../../../lib/rules/jsx-child-element-spacing');
const RuleTester = require('eslint').RuleTester;
const parserOptions = {
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const ERROR_MESSAGE = [{message: 'Ambiguous spacing between child elements.'}];

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-child-element-spacing', rule, {
  valid: [{
    code: `
      <App>
        foo
        bar
      </App>
    `
  }, {
    code: `
      <App>
        <a>foo</a>
        <a>bar</a>
      </App>
    `
  }, {
    code: `
      <App>
        foo<a>bar</a>baz
      </App>
    `
  }, {
    code: `
      <App>
        foo
        {' '}
        <a>bar</a>
        {' '}
        baz
      </App>
    `
  }, {
    code: `
      <App>
        foo{/*
        */}<a>bar</a>{/*
        */}baz
      </App>
    `
  }],

  invalid: [{
    code: `
      <App>
        foo
        <a>bar</a>
      </App>
    `,
    errors: ERROR_MESSAGE
  }, {
    code: `
      <App>
        <a>bar</a>
        baz
      </App>
    `,
    errors: ERROR_MESSAGE
  }]
});
