/**
 * @fileoverview Tests for props-destructuring
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/props-destructuring');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('props-destructuring', rule, {

  valid: [{
    code: `
      function Component(props) {
        const {
          prop1,
          prop2,
        } = props;
        return (
          <div>
            {prop1}
            {prop2}
          </div>
        );
      }
    `
  }, {
    code: `
      function Component({ prop1, prop2 }) {
        return (
          <div>
            {prop1}
            {prop2}
          </div>
        );
      }
    `
  }, {
    code: `
      const Component = (props) => {
        const {
          prop1,
          prop2,
        } = props;

        return (
          <div>
            {prop1}
            {prop2}
          </div>
        );
      };
    `
  }, {
    code: `
      const Component = ({ prop1, prop2, }) => (
        <div>
          {prop1}
          {prop2}
        </div>
      );
    `
  }],

  invalid: [{
    code: `
      function Component({
        prop1,
        prop2,
      }) {
        return (
          <div>
            {prop1}
            {prop2}
          </div>
        );
      }
    `,
    errors: [{
      messageId: 'noMultilinePropsDestructuring',
      line: 2,
      column: 26,
      type: 'FunctionDeclaration'
    }]
  }, {
    code: `
      const Component = ({
        prop1,
        prop2,
      }) => (
        <div>
          {prop1}
          {prop2}
        </div>
      );
    `,
    errors: [{
      messageId: 'noMultilinePropsDestructuring',
      line: 2,
      column: 26,
      type: 'ArrowFunctionExpression'
    }]
  }]
});
