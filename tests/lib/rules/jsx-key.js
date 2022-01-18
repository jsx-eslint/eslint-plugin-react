/**
 * @fileoverview Report missing `key` props in iterators/collection literals.
 * @author Ben Mosher
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-key');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const settings = {
  react: {
    pragma: 'Act',
    fragment: 'Frag',
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('jsx-key', rule, {
  valid: parsers.all([
    { code: 'fn()' },
    { code: '[1, 2, 3].map(function () {})' },
    { code: '<App />;' },
    { code: '[<App key={0} />, <App key={1} />];' },
    { code: '[1, 2, 3].map(function(x) { return <App key={x} /> });' },
    { code: '[1, 2, 3].map(x => <App key={x} />);' },
    { code: '[1, 2, 3].map(x => { return <App key={x} /> });' },
    { code: '[1, 2, 3].foo(x => <App />);' },
    { code: 'var App = () => <div />;' },
    { code: '[1, 2, 3].map(function(x) { return; });' },
    { code: 'foo(() => <div />);' },
    {
      code: 'foo(() => <></>);',
      features: ['fragment'],
    },
    {
      code: '<></>;',
      features: ['fragment'],
    },
    {
      code: '<App {...{}} />;',
    },
    {
      code: '<App key="keyBeforeSpread" {...{}} />;',
      options: [{ checkKeyMustBeforeSpread: true }],
    },
    {
      code: '<div key="keyBeforeSpread" {...{}} />;',
      options: [{ checkKeyMustBeforeSpread: true }],
    },
  ]),
  invalid: parsers.all([
    {
      code: '[<App />];',
      errors: [{ messageId: 'missingArrayKey' }],
    },
    {
      code: '[<App {...key} />];',
      errors: [{ messageId: 'missingArrayKey' }],
    },
    {
      code: '[<App key={0}/>, <App />];',
      errors: [{ messageId: 'missingArrayKey' }],
    },
    {
      code: '[1, 2 ,3].map(function(x) { return <App /> });',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2 ,3].map(x => <App />);',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2 ,3].map(x => { return <App /> });',
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2, 3]?.map(x => <BabelEslintApp />)',
      features: ['no-default'],
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2, 3]?.map(x => <TypescriptEslintApp />)',
      features: ['ts'],
      errors: [{ messageId: 'missingIterKey' }],
    },
    {
      code: '[1, 2, 3].map(x => <>{x}</>);',
      features: ['fragment'],
      options: [{ checkFragmentShorthand: true }],
      settings,
      errors: [
        {
          messageId: 'missingIterKeyUsePrag',
          data: {
            reactPrag: 'Act',
            fragPrag: 'Frag',
          },
        },
      ],
    },
    {
      code: '[<></>];',
      features: ['fragment'],
      options: [{ checkFragmentShorthand: true }],
      settings,
      errors: [
        {
          messageId: 'missingArrayKeyUsePrag',
          data: {
            reactPrag: 'Act',
            fragPrag: 'Frag',
          },
        },
      ],
    },
    {
      code: '[<App {...obj} key="keyAfterSpread" />];',
      options: [{ checkKeyMustBeforeSpread: true }],
      settings,
      errors: [{ messageId: 'keyBeforeSpread' }],
    },
    {
      code: '[<div {...obj} key="keyAfterSpread" />];',
      options: [{ checkKeyMustBeforeSpread: true }],
      settings,
      errors: [{ messageId: 'keyBeforeSpread' }],
    },
  ]),
});
