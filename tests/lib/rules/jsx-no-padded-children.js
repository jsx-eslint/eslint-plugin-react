/**
 * @fileoverview Test for js-no-padded-children
 **/
'use strict';

const rule = require('../../../lib/rules/jsx-no-padded-children');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

const ruleTester = new RuleTester({parserOptions});

const message = 'JSX children must not be padded by blank lines.';

ruleTester.run('jsx-no-padded-children', rule, {
  valid: [
    '<div><Foo /></div>',

    `
      <div>
        <Foo />
      </div>`,

    `
      <div>
        foo
        <Foo />
      </div>`,

    {
      code: `
      <>{\`


      \`}</>`,
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: `
        <div>

        </div>`,
      output: `
        <div>
        </div>`,
      errors: [{message}]
    },
    {
      code: [
        '<div>',
        '  ',
        '  ',
        '</div>'
      ].join('\r\n'),
      output: [
        '<div>',
        '</div>'
      ].join('\r\n'),
      errors: [{message}]
    },
    {
      code: `
        <div>

         \ \t
          <Foo />
        </div>`,
      output: `
        <div>
          <Foo />
        </div>`,
      errors: [{message}]
    },
    {
      code: `
        <div>
          <Foo />

        </div>`,
      output: `
        <div>
          <Foo />
        </div>`,
      errors: [{message}]
    },
    {
      code: `
        <div>


          <Foo />

            \ \r \t
        </div>`,
      output: `
        <div>
          <Foo />
        </div>`,
      errors: [{message}, {message}]
    },
    {
      code: `
        <div>
          <Foo />
            \ \t

        </div>`,
      output: `
        <div>
          <Foo />
        </div>`,
      errors: [{message}]
    },
    {
      code: `
        <div>
          \r \t

              foo

          \r \t
        </div>`,
      output: `
        <div>
              foo
        </div>`,
      errors: [{message}, {message}]
    },
    {
      code: `
        <div>
              foo

          \r \t
        </div>`,
      output: `
        <div>
              foo
        </div>`,
      errors: [{message}]
    },

    {
      code: [
        '<div>',
        '  ',
        '  <Foo />',
        '  ',
        '</div>'
      ].join('\r\n'),
      output: [
        '<div>',
        '  <Foo />',
        '</div>'
      ].join('\r\n'),
      errors: [{message}, {message}]
    },
    {
      code: `
        <div>


          <>
            
          \ \t \r
          </>


        </div>`,
      output: `
        <div>
          <>
          </>
        </div>`,
      errors: [{message}, {message}, {message}],
      parser: 'babel-eslint'
    },
    {
      code: `
        <div>

          {'foo'}

          foo

          {'bar'}


        </div>`,
      output: `
        <div>
          {'foo'}

          foo

          {'bar'}
        </div>`,
      errors: [{message}, {message}],
      parser: 'babel-eslint'
    }
  ]
});
