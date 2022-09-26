/**
 * @fileoverview every addEventListener should have a matching removeEventListener in the return statement of the same useEffect block
 * @author AndreaPontrandolfo
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/ensure-matching-remove-event-listener');

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('ensure-matching-remove-event-listener', rule, {
  valid: [
    `useEffect(() => {
      doThis();
      doMoreOfThis();
      window.addEventListener("keydown", handleUserKeyPress);
      doOtherStuff();
      doSomeOtherStuff();
      return () => {
        doThatBefore();
        doMoreOfThatBefore();
        window.removeEventListener("keydown", handleUserKeyPress);
        doThatAfter();
        doMoreOfThatAfter();
      };
    }, [])`,
    `useEffect(() => {
      refcurrent = value;
    }, [value]);`,
  ],

  invalid: [
    {
      code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
      }, [])`,
      errors: [
        {
          messageId: 'requiredCleanup',
          type: 'ExpressionStatement',
        },
      ],
    },
    {
      code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        const content = window;
        content.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
      }, [])`,
      errors: [
        {
          messageId: 'requiredCleanup',
          type: 'ExpressionStatement',
        },
      ],
    },
    {
      code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          doMoreOfThat();
        };
      }, [])`,
      errors: [
        {
          messageId: 'requiredRemoveEventListener',
          type: 'ExpressionStatement',
        },
      ],
    },
    {
      code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        const content = window;
        content.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          doMoreOfThat();
        };
      }, [])`,
      errors: [
        {
          messageId: 'requiredRemoveEventListener',
          type: 'ExpressionStatement',
        },
      ],
    },
    {
      code: `useEffect(() => {
        doThis();
        doMoreOfThis();
        window.addEventListener("keydown", handleUserKeyPress);
        doOtherStuff();
        doSomeOtherStuff();
        return () => {
          doThat();
          window.addEventListener("keydown", handleUserKeyPress);
          doMoreOfThat();
        };
      }, [])`,
      errors: [
        {
          messageId: 'requiredRemoveEventListener',
          type: 'ExpressionStatement',
        },
      ],
    },
  ],
});
