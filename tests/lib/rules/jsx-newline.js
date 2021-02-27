/**
 * @fileoverview Require or prevent a new line after jsx elements and expressions
 * @author Johnny Zabala
 * @author Joseph Stiles
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-newline');
const parsers = require('../../helpers/parsers');

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

const tests = {
  valid: [
    `
    <div>
      <Button>{data.label}</Button>

      <List />

      <Button>
        <IconPreview />
        Button 2

        <span></span>
      </Button>

      {showSomething === true && <Something />}

      <Button>Button 3</Button>

      {showSomethingElse === true ? (
        <SomethingElse />
      ) : (
        <ErrorMessage />
      )}
    </div>
    `
  ],
  invalid: [
    {
      code: `
        <div>
          <Button>{data.label}</Button>
          <List />
        </div>
      `,
      output: `
        <div>
          <Button>{data.label}</Button>

          <List />
        </div>
      `,
      errors: [{
        messageId: 'require'
      }]
    },
    {
      code: `
        <div>
          <Button>{data.label}</Button>
          {showSomething === true && <Something />}
        </div>
      `,
      output: `
        <div>
          <Button>{data.label}</Button>

          {showSomething === true && <Something />}
        </div>
      `,
      errors: [{
        messageId: 'require'
      }]
    },
    {
      code: `
        <div>
          {showSomething === true && <Something />}
          <Button>{data.label}</Button>
        </div>
      `,
      output: `
        <div>
          {showSomething === true && <Something />}

          <Button>{data.label}</Button>
        </div>
      `,
      errors: [{
        messageId: 'require'
      }]
    },
    {
      code: `
        <div>
          {showSomething === true && <Something />}
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      output: `
        <div>
          {showSomething === true && <Something />}

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      errors: [{
        messageId: 'require'
      }]
    },
    {
      code: `
        <div>
          <div>
            <button></button>
            <button></button>
          </div>
          <div>
            <span></span>
            <span></span>
          </div>
        </div>
      `,
      output: `
        <div>
          <div>
            <button></button>

            <button></button>
          </div>

          <div>
            <span></span>

            <span></span>
          </div>
        </div>
      `,
      errors: [
        {messageId: 'require'},
        {messageId: 'require'},
        {messageId: 'require'}
      ]
    }
  ]
};

const advanceFeatTest = {
  valid: [
    {
      code: `
        <>
          <Button>{data.label}</Button>
          Test

          <span>Should be in new line</span>
        </>
      `
    }
  ],
  invalid: [
    {
      code: `
        <>
          <Button>{data.label}</Button>
          Test
          <span>Should be in new line</span>
        </>
      `,
      output: `
        <>
          <Button>{data.label}</Button>
          Test

          <span>Should be in new line</span>
        </>
      `,
      errors: [
        {messageId: 'require'}
      ]
    }
  ]
};

// Run tests with default parser
new RuleTester({parserOptions}).run('jsx-newline', rule, tests);

// Run tests with babel parser
let ruleTester = new RuleTester({parserOptions, parser: parsers.BABEL_ESLINT});
ruleTester.run('jsx-newline', rule, tests);
ruleTester.run('jsx-newline', rule, advanceFeatTest);

// Run tests with typescript parser
ruleTester = new RuleTester({parserOptions, parser: parsers.TYPESCRIPT_ESLINT});
ruleTester.run('jsx-newline', rule, tests);
ruleTester.run('jsx-newline', rule, advanceFeatTest);

ruleTester = new RuleTester({parserOptions, parser: parsers['@TYPESCRIPT_ESLINT']});
ruleTester.run('jsx-newline', rule, {
  valid: parsers.TS(tests.valid),
  invalid: parsers.TS(tests.invalid)
});
ruleTester.run('jsx-newline', rule, {
  valid: parsers.TS(advanceFeatTest.valid),
  invalid: parsers.TS(advanceFeatTest.invalid)
});

// ------------------------------------------------------------------------------
// Tests: { prevent: true }
// --------- ---------------------------------------------------------------------

const preventionTests = {
  valid: [
    {
      code: `
        <div>
          <Button>{data.label}</Button>
          <List />
          <Button>
            <IconPreview />
            Button 2
            <span></span>
          </Button>
          {showSomething === true && <Something />}
          <Button>Button 3</Button>
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      options: [{
        prevent: true
      }]
    }
  ],
  invalid: [
    {
      output: `
        <div>
          <Button>{data.label}</Button>
          <List />
        </div>
      `,
      code: `
        <div>
          <Button>{data.label}</Button>

          <List />
        </div>
      `,
      errors: [{
        messageId: 'prevent'
      }],
      options: [{
        prevent: true
      }]
    },
    {
      output: `
        <div>
          <Button>{data.label}</Button>
          {showSomething === true && <Something />}
        </div>
      `,
      code: `
        <div>
          <Button>{data.label}</Button>

          {showSomething === true && <Something />}
        </div>
      `,
      errors: [{
        messageId: 'prevent'
      }],
      options: [{
        prevent: true
      }]
    },
    {
      output: `
        <div>
          {showSomething === true && <Something />}
          <Button>{data.label}</Button>
        </div>
      `,
      code: `
        <div>
          {showSomething === true && <Something />}

          <Button>{data.label}</Button>
        </div>
      `,
      errors: [{
        messageId: 'prevent'
      }],
      options: [{
        prevent: true
      }]
    },
    {
      output: `
        <div>
          {showSomething === true && <Something />}
          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      code: `
        <div>
          {showSomething === true && <Something />}

          {showSomethingElse === true ? (
            <SomethingElse />
          ) : (
            <ErrorMessage />
          )}
        </div>
      `,
      errors: [{
        messageId: 'prevent'
      }],
      options: [{
        prevent: true
      }]
    },
    {
      output: `
        <div>
          <div>
            <button></button>
            <button></button>
          </div>
          <div>
            <span></span>
            <span></span>
          </div>
        </div>
      `,
      code: `
        <div>
          <div>
            <button></button>

            <button></button>
          </div>

          <div>
            <span></span>

            <span></span>
          </div>
        </div>
      `,
      errors: [
        {messageId: 'prevent'},
        {messageId: 'prevent'},
        {messageId: 'prevent'}
      ],
      options: [{
        prevent: true
      }]
    }
  ]
};

const preventionAdvanceFeatTest = {
  valid: [
    {
      code: `
        <>
          <Button>{data.label}</Button>
          Test
          <span>Should be in new line</span>
        </>
      `,
      options: [{
        prevent: true
      }]
    }
  ],
  invalid: [
    {
      output: `
        <>
          <Button>{data.label}</Button>
          Test
          <span>Should be in new line</span>
        </>
      `,
      code: `
        <>
          <Button>{data.label}</Button>
          Test

          <span>Should be in new line</span>
        </>
      `,
      errors: [
        {messageId: 'prevent'}
      ],
      options: [{
        prevent: true
      }]
    }
  ]
};

// // Run tests with default parser
new RuleTester({parserOptions}).run('jsx-newline', rule, preventionTests);

// // Run tests with babel parser
ruleTester = new RuleTester({parserOptions, parser: parsers.BABEL_ESLINT});
ruleTester.run('jsx-newline', rule, preventionTests);
ruleTester.run('jsx-newline', rule, preventionAdvanceFeatTest);

// // Run tests with typescript parser
ruleTester = new RuleTester({parserOptions, parser: parsers.TYPESCRIPT_ESLINT});
ruleTester.run('jsx-newline', rule, preventionTests);
ruleTester.run('jsx-newline', rule, preventionAdvanceFeatTest);

ruleTester = new RuleTester({parserOptions, parser: parsers['@TYPESCRIPT_ESLINT']});
ruleTester.run('jsx-newline', rule, {
  valid: parsers.TS(preventionTests.valid),
  invalid: parsers.TS(preventionTests.invalid)
});
ruleTester.run('jsx-newline', rule, {
  valid: parsers.TS(preventionAdvanceFeatTest.valid),
  invalid: parsers.TS(preventionAdvanceFeatTest.invalid)
});
