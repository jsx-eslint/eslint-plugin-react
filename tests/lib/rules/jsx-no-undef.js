/**
 * @fileoverview Tests for jsx-no-undef
 * @author Yannick Croissant
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const eslint = require('eslint');
const rule = require('../../../lib/rules/jsx-no-undef');

const RuleTester = eslint.RuleTester;

const parsers = require('../../helpers/parsers');

const languageOptions = {
  ecmaVersion: 2018,
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    jsxPragma: null,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions,
  rules: {
    'no-undef': 'error',
  },
});

ruleTester.run('jsx-no-undef', rule, {
  valid: parsers.all([
    {
      code: '/*eslint no-undef:1*/ var React, App; React.render(<App />);',
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<img />);',
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<x-gif />);',
    },
    {
      code: '/*eslint no-undef:1*/ var React, app; React.render(<app.Foo />);',
    },
    {
      code: '/*eslint no-undef:1*/ var React, app; React.render(<app.foo.Bar />);',
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<Apppp:Foo />);',
      features: ['jsx namespace'],
    },
    {
      code: `
        /*eslint no-undef:1*/
        var React;
        class Hello extends React.Component {
          render() {
            return <this.props.tag />
          }
        }
      `,
    },
    {
      code: 'var React; React.render(<Text />);',
      languageOptions: {
        globals: {
          Text: "readonly",
        }
      },
      features: ['no-babel'], // TODO: FIXME: remove `no-babel` and fix
      options: [{ allowGlobals: true }],
    },
    {
      code: `
        import Text from "cool-module";
        const TextWrapper = function (props) {
          return (
            <Text />
          );
        };
      `,
      languageOptions: Object.assign({ sourceType: 'module' }, languageOptions),
    },
  ].map(parsers.disableNewTS)),

  invalid: parsers.all([
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<App />);',
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'App' },
        },
      ],
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<Appp.Foo />);',
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'Appp' },
        },
      ],
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<appp.Foo />);',
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'appp' },
        },
      ],
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<appp.foo.Bar />);',
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'appp' },
        },
      ],
    },
    {
      code: `
        const TextWrapper = function (props) {
          return (
            <Text />
          );
        };
        export default TextWrapper;
      `,
      languageOptions: Object.assign({ sourceType: 'module' }, languageOptions),
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'Text' },
        },
      ],
      languageOptions: {
        globals: {
          Text: true,
        }
      },
    },
    {
      code: '/*eslint no-undef:1*/ var React; React.render(<Foo />);',
      errors: [
        {
          messageId: 'undefined',
          data: { identifier: 'Foo' },
        },
      ],
    },
  ].map(parsers.disableNewTS)),
});
