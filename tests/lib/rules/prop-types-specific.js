/**
 * @fileoverview Prevent missing props validation in a React component definition
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/prop-types');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// const settings = {
//   react: {
//     pragma: 'Foo'
//   }
// };

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('prop-types', rule, {
  valid: [
  ],
  invalid: [
    {
      code: `
        const Foo = ({ a: renamedA }) => {
          const { b } = renamedA
          return <div>test</div>
        }
        Foo.propTypes = {
          a: PropTypes.object.shape({}),
        }
      `,
      errors: [
        {message: '\'a.b\' is missing in props validation'}
      ],
      parser: 'babel-eslint'
    }
  ]
});
