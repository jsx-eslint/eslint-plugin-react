/**
 * @fileoverview Enforce a new line after jsx elements and expressions
 * @author Johnny Zabala
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
        message: 'JSX element should start in a new line'
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
        message: 'JSX element should start in a new line'
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
        message: 'JSX element should start in a new line'
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
        message: 'JSX element should start in a new line'
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
        {message: 'JSX element should start in a new line'},
        {message: 'JSX element should start in a new line'},
        {message: 'JSX element should start in a new line'}
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
        {message: 'JSX element should start in a new line'}
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
