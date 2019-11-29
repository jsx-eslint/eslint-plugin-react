/**
 * @fileoverview Prevent usage of `javascript:` URLs
 * @author Sergei Startsev
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-no-script-url');

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
const message = 'A future version of React will block javascript: URLs as a security precaution. ' +
  'Use event handlers instead if you can. If you need to generate unsafe HTML, try using dangerouslySetInnerHTML instead.';
const defaultErrors = [{message}];

ruleTester.run('jsx-no-script-url', rule, {
  valid: [
    {code: '<a href="https://reactjs.org"></a>'},
    {code: '<a href="mailto:foo@bar.com"></a>'},
    {code: '<a href="#"></a>'},
    {code: '<a href=""></a>'},
    {code: '<a name="foo"></a>'},
    {code: '<a href={"javascript:"}></a>'},
    {code: '<Foo href="javascript:"></Foo>'}
  ],
  invalid: [{
    code: '<a href="javascript:"></a>',
    errors: defaultErrors
  }, {
    code: '<a href="javascript:void(0)"></a>',
    errors: defaultErrors
  }, {
    code: '<a href="j\n\n\na\rv\tascript:"></a>',
    errors: defaultErrors
  }, {
    code: '<Foo to="javascript:"></Foo>',
    errors: defaultErrors,
    options: [[{name: 'Foo', props: ['to', 'href']}]]
  }, {
    code: '<Foo href="javascript:"></Foo>',
    errors: defaultErrors,
    options: [[{name: 'Foo', props: ['to', 'href']}]]
  }, {
    code: `
      <div>
        <Foo href="javascript:"></Foo>
        <Bar link="javascript:"></Bar>
      </div>
    `,
    errors: [{message}, {message}],
    options: [[{name: 'Foo', props: ['to', 'href']}, {name: 'Bar', props: ['link']}]]
  }]
});
