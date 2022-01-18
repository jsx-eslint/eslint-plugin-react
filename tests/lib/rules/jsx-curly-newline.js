/**
 * @fileoverview enforce consistent line breaks inside jsx curly
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-curly-newline');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const LEFT_MISSING_ERROR = { messageId: 'expectedAfter', type: 'Punctuator' };
const LEFT_UNEXPECTED_ERROR = { messageId: 'unexpectedAfter', type: 'Punctuator' };
const RIGHT_MISSING_ERROR = { messageId: 'expectedBefore', type: 'Punctuator' };
const RIGHT_UNEXPECTED_ERROR = { messageId: 'unexpectedBefore', type: 'Punctuator' };
// const EXPECTED_BETWEEN = {messageId: 'expectedBetween', type: 'Identifier'};

const CONSISTENT = ['consistent'];
const NEVER = ['never'];
const MULTILINE_REQUIRE = [{ singleline: 'consistent', multiline: 'require' }];

const ruleTester = new RuleTester({ parserOptions });

ruleTester.run('jsx-curly-newline', rule, {
  valid: parsers.all([
    // consistent option (default)
    {
      code: '<div>{foo}</div>',
      options: ['consistent'],
    },

    {
      code: `
        <div>
          {
            foo
          }
        </div>
      `,
      options: CONSISTENT,
    },

    {
      code: `
        <div>
          { foo &&
            foo.bar }
        </div>
      `,
      options: CONSISTENT,
    },

    {
      code: `
        <div>
          {
            foo &&
            foo.bar
          }
        </div>
      `,
      options: CONSISTENT,
    },

    {
      code: `
        <div foo={
          bar
        } />
      `,
      options: CONSISTENT,
    },

    // {singleline: 'consistent', multiline: 'require'} option
    {
      code: '<div>{foo}</div>',
      options: MULTILINE_REQUIRE,
    },
    {
      code: '<div foo={bar} />',
      options: MULTILINE_REQUIRE,
    },
    {
      code: `
        <div>
          {
            foo &&
            foo.bar
          }
        </div>
      `,
      options: MULTILINE_REQUIRE,
    },
    {
      code: `
        <div>
          {
            foo
          }
        </div>
      `,
      options: MULTILINE_REQUIRE,
    },

    // never option

    {
      code: '<div>{foo}</div>',
      options: NEVER,
    },

    {
      code: '<div foo={bar} />',
      options: NEVER,
    },

    {
      code: `
        <div>
          { foo &&
            foo.bar }
        </div>
      `,
      options: NEVER,
    },
  ]),

  invalid: parsers.all([
    // consistent option (default)
    {
      code: `
        <div>
          { foo \n}
        </div>
      `,
      output: `
        <div>
          { foo}
        </div>
      `,
      options: CONSISTENT,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },

    {
      code: `
        <div>
          { foo &&
            foo.bar \n}
        </div>
      `,
      output: `
        <div>
          { foo &&
            foo.bar}
        </div>
      `,
      options: CONSISTENT,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
    {
      code: `
        <div>
          { foo &&
            bar
          }
        </div>
      `,
      output: `
        <div>
          { foo &&
            bar}
        </div>
      `,
      options: CONSISTENT,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },

    // {singleline: 'consistent', multiline: 'require'} option
    {
      code: '<div>{foo\n}</div>',
      output: '<div>{foo}</div>',
      errors: [RIGHT_UNEXPECTED_ERROR],
      options: MULTILINE_REQUIRE,
    },
    {
      code: '<div>{\nfoo}</div>',
      output: '<div>{\nfoo\n}</div>',
      errors: [RIGHT_MISSING_ERROR],
      options: MULTILINE_REQUIRE,
    },
    {
      code: `
        <div>
          { foo &&
            bar }
        </div>
      `,
      output: `
        <div>
          {\n foo &&
            bar \n}
        </div>
      `,
      errors: [LEFT_MISSING_ERROR, RIGHT_MISSING_ERROR],
      options: MULTILINE_REQUIRE,
    },
    {
      code: `
        <div style={foo &&
          foo.bar
        } />
      `,
      output: `
        <div style={\nfoo &&
          foo.bar
        } />
      `,
      errors: [LEFT_MISSING_ERROR],
      options: MULTILINE_REQUIRE,
    },

    // never options
    {
      code: `
        <div>
          {\nfoo\n}
        </div>
      `,
      output: `
        <div>
          {foo}
        </div>
      `,
      options: NEVER,
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },

    {
      code: `
        <div>
          {
            foo &&
            foo.bar
          }
        </div>
      `,
      output: `
        <div>
          {foo &&
            foo.bar}
        </div>
      `,
      options: NEVER,
      errors: [LEFT_UNEXPECTED_ERROR, RIGHT_UNEXPECTED_ERROR],
    },

    {
      code: `
        <div>
          { foo &&
            foo.bar
          }
        </div>
      `,
      output: `
        <div>
          { foo &&
            foo.bar}
        </div>
      `,
      options: NEVER,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },

    {
      code: `
        <div>
          { /* not fixed due to comment */
            foo }
        </div>
      `,
      output: null,
      options: NEVER,
      errors: [LEFT_UNEXPECTED_ERROR],
    },

    {
      code: `
        <div>
          { foo
            /* not fixed due to comment */}
        </div>
      `,
      output: null,
      options: NEVER,
      errors: [RIGHT_UNEXPECTED_ERROR],
    },
  ]),
});
