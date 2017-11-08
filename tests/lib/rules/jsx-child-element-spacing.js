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
      </App>
    `
  }, {
    code: `
      <App>
        <a>bar</a>
      </App>
    `
  }, {
    code: `
      <App>
        <a>
          <b>nested</b>
        </a>
      </App>
    `
  }, {
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
        foo
        {' '}<a>bar</a>{' '}
        baz
      </App>
    `
  }, {
    code: `
      <App>
        foo{' '}
        <a>bar</a>
        {' '}baz
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
  }, {
    code: `
      <App>
        Please take a look at <a href="https://js.org">this link</a>.
      </App>
    `
  }, {
    code: `
      <App>
        Please take a look at
        {' '}
        <a href="https://js.org">this link</a>.
      </App>
    `
  }, {
    code: `
      <App>
        <p>A</p>
        <p>B</p>
      </App>
    `
  }, {
    code: `
      <App>
        <p>A</p><p>B</p>
      </App>
    `
  }, {
    code: `
      <App>
        A
        B
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
  }, {
    code: `
      <App>
        {' '}<a>bar</a>
        baz
      </App>
    `,
    errors: ERROR_MESSAGE
  }, {
    code: `
      <App>
        Please take a look at
        <a href="https://js.org">this link</a>.
      </App>
    `,
    errors: ERROR_MESSAGE
  }, {
    code: `
      <App>
        Here is
        <a href="https://js.org">a link</a> and here is
        <a href="https://js.org">another</a>
      </App>
    `,
    errors: ERROR_MESSAGE
  }, {
    code: `
      <App>
        <a>
          <b>nested1</b>
          <b>nested2</b>
        </a>
      </App>
    `,
    errors: ERROR_MESSAGE
  }]
});
