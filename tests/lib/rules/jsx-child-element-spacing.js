'use strict';

const rule = require('../../../lib/rules/jsx-child-element-spacing');
const RuleTester = require('eslint').RuleTester;
const parserOptions = {
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

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
      <>
        foo
      </>
    `,
    parser: 'babel-eslint'
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
        <a>foo</a>
        <a>bar</a>
      </App>
    `
  }, {
    code: `
      <App>
        <a>
          <b>nested1</b>
          <b>nested2</b>
        </a>
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
    errors: [
      {
        message: 'Ambiguous spacing before next element a',
        line: 4,
        column: 3
      }
    ]
  }, {
    code: `
<>
  foo
  <a>bar</a>
</>
    `,
    parser: 'babel-eslint',
    errors: [
      {
        message: 'Ambiguous spacing before next element a',
        line: 4,
        column: 3
      }
    ]
  }, {
    code: `
<App>
  <a>bar</a>
  baz
</App>
    `,
    errors: [
      {
        message: 'Ambiguous spacing after previous element a',
        line: 3,
        column: 13
      }
    ]
  }, {
    code: `
<App>
  {' '}<a>bar</a>
  baz
</App>
    `,
    errors: [
      {
        message: 'Ambiguous spacing after previous element a',
        line: 3,
        column: 18
      }
    ]
  }, {
    code: `
<App>
  Please take a look at
  <a href="https://js.org">this link</a>.
</App>
    `,
    errors: [
      {
        message: 'Ambiguous spacing before next element a',
        line: 4,
        column: 3
      }
    ]
  }, {
    code: `
<App>
  Some <code>loops</code> and some
  <code>if</code> statements.
</App>
    `,
    errors: [
      {
        message: 'Ambiguous spacing before next element code',
        line: 4,
        column: 3
      }
    ]
  }, {
    code: `
<App>
  Here is
  <a href="https://js.org">a link</a> and here is
  <a href="https://js.org">another</a>
</App>
    `,
    errors: [
      {
        message: 'Ambiguous spacing before next element a',
        line: 4,
        column: 3
      },
      {
        message: 'Ambiguous spacing before next element a',
        line: 5,
        column: 3
      }
    ]
  }]
});
