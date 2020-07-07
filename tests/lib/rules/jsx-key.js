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
    jsx: true
  }
};

const settings = {
  react: {
    pragma: 'Act',
    fragment: 'Frag'
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tests = {
  valid: [
    {code: 'fn()'},
    {code: '[1, 2, 3].map(function () {})'},
    {code: '<App />;'},
    {code: '[<App key={0} />, <App key={1} />];'},
    {code: '[1, 2, 3].map(function(x) { return <App key={x} /> });'},
    {code: '[1, 2, 3].map(x => <App key={x} />);'},
    {code: '[1, 2, 3].map(x => { return <App key={x} /> });'},
    {code: '[1, 2, 3].foo(x => <App />);'},
    {code: 'var App = () => <div />;'},
    {code: '[1, 2, 3].map(function(x) { return; });'},
    {code: 'foo(() => <div />);'},
    {
      code: `
        <div>
          <App key="one" />
          <div key="two" />
          <App key="one" />
        </div>
      `,
      options: [{checkUniquePropKey: false}]
    },
    {
      code: '[<App key="test" />, <App key="test" />];',
      options: [{checkUniquePropKey: false}]
    },
    `
      <div>
        <App key="one" />
        <App key="two" />
      </div>
    `
  ],
  invalid: [
    {
      code: '[<App />];',
      errors: [{message: 'Missing "key" prop for element in array'}]
    },
    {
      code: '[<App key="one" />, <App key="one" />];',
      errors: [{message: '"key" prop must be unique'}]
    },
    {
      code: '[<App {...key} />];',
      errors: [{message: 'Missing "key" prop for element in array'}]
    },
    {
      code: '[<App key={0}/>, <App />];',
      errors: [{message: 'Missing "key" prop for element in array'}]
    },
    {
      code: '[1, 2 ,3].map(function(x) { return <App /> });',
      errors: [{message: 'Missing "key" prop for element in iterator'}]
    },
    {
      code: '[1, 2 ,3].map(x => <App />);',
      errors: [{message: 'Missing "key" prop for element in iterator'}]
    },
    {
      code: '[1, 2 ,3].map(x => { return <App /> });',
      errors: [{message: 'Missing "key" prop for element in iterator'}]
    },
    {
      code: `
        <div>
          <App key="one" />
          <div key="two" />
          <App key="one" />
        </div>
      `,
      errors: [{message: '"key" prop must be unique'}]
    }
  ]
};

const advanceFeatTests = {
  valid: [
    {code: 'foo(() => <></>);'},
    {code: '<></>;'}
  ],
  invalid: [
    {
      code: '[1, 2, 3]?.map(x => <BabelEslintApp />)',
      errors: [{message: 'Missing "key" prop for element in iterator'}]
    },
    {
      code: '[1, 2, 3]?.map(x => <TypescriptEslintApp />)',
      errors: [{message: 'Missing "key" prop for element in iterator'}]
    },
    {
      code: '[1, 2, 3].map(x => <>{x}</>);',
      options: [{checkFragmentShorthand: true}],
      settings,
      errors: [{message: 'Missing "key" prop for element in iterator. Shorthand fragment syntax does not support providing keys. Use Act.Frag instead'}]
    },
    {
      code: '[<></>];',
      options: [{checkFragmentShorthand: true}],
      settings,
      errors: [{message: 'Missing "key" prop for element in array. Shorthand fragment syntax does not support providing keys. Use Act.Frag instead'}]
    }
  ]
};

// Run tests with default parser
new RuleTester({parserOptions}).run('jsx-key', rule, tests);

// Run tests with babel parser
let ruleTester = new RuleTester({parserOptions, parser: parsers.BABEL_ESLINT});
ruleTester.run('jsx-key', rule, tests);
ruleTester.run('jsx-key', rule, advanceFeatTests);

// Run tests with typescript parser
ruleTester = new RuleTester({parserOptions, parser: parsers.TYPESCRIPT_ESLINT});
ruleTester.run('jsx-key', rule, tests);
ruleTester.run('jsx-key', rule, advanceFeatTests);

ruleTester = new RuleTester({parserOptions, parser: parsers['@TYPESCRIPT_ESLINT']});
ruleTester.run('jsx-key', rule, {
  valid: parsers.TS(tests.valid),
  invalid: parsers.TS(tests.invalid)
});
ruleTester.run('jsx-key', rule, {
  valid: parsers.TS(advanceFeatTests.valid),
  invalid: parsers.TS(advanceFeatTests.invalid)
});
