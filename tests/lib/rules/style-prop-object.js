/**
 * @fileoverview Enforce style prop value is an object
 * @author David Petersen
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/style-prop-object');

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

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('style-prop-object', rule, {
  valid: parsers.all([
    {
      code: '<div style={{ color: "red" }} />',
    },
    {
      code: '<Hello style={{ color: "red" }} />',
    },
    {
      code: `
        function redDiv() {
          const styles = { color: "red" };
          return <div style={styles} />;
        }
      `,
    },
    {
      code: `
        function redDiv() {
          const styles = { color: "red" };
          return <Hello style={styles} />;
        }
      `,
    },
    {
      code: `
        const styles = { color: "red" };
        function redDiv() {
          return <div style={styles} />;
        }
      `,
    },
    {
      code: `
        function redDiv(props) {
          return <div style={props.styles} />;
        }
      `,
    },
    {
      code: `
        import styles from './styles';
        function redDiv() {
          return <div style={styles} />;
        }
      `,
    },
    {
      code: `
        import mystyles from './styles';
        const styles = Object.assign({ color: 'red' }, mystyles);
        function redDiv() {
          return <div style={styles} />;
        }
      `,
    },
    {
      code: `
        const otherProps = { style: { color: "red" } };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `,
    },
    {
      code: `
        const styles = Object.assign({ color: 'red' }, mystyles);
        React.createElement("div", { style: styles });
      `,
      parserOptions: Object.assign({ sourceType: 'module' }, parserOptions),
    },
    {
      code: '<div style></div>',
    },
    {
      code: `
        React.createElement(MyCustomElem, {
          [style]: true
        }, 'My custom Elem')
      `,
    },
    {
      code: `
        let style;
        <div style={style}></div>
      `,
    },
    {
      code: `
        let style = null;
        <div style={style}></div>
      `,
    },
    {
      code: `
        let style = undefined;
        <div style={style}></div>
      `,
    },
    {
      code: '<div style={undefined}></div>',
    },
    {
      code: `
        const props = { style: undefined };
        <div {...props} />
      `,
    },
    {
      code: `
        const otherProps = { style: undefined };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `,
    },
    {
      code: `
        React.createElement("div", {
          style: undefined
        })
      `,
    },
    {
      code: `
        let style;
        React.createElement("div", {
          style
        })
      `,
    },
    {
      code: '<div style={null}></div>',
    },
    {
      code: `
        const props = { style: null };
        <div {...props} />
      `,
    },
    {
      code: `
        const otherProps = { style: null };
        const { a, b, ...props } = otherProps;
        <div {...props} />
      `,
    },
    {
      code: `
        React.createElement("div", {
          style: null
        })
      `,
    },
    {
      code: `
        const MyComponent = (props) => {
          React.createElement(MyCustomElem, {
            ...props
          });
        };
      `,
    },
    {
      code: '<MyComponent style="myStyle" />',
      options: [{ allow: ['MyComponent'] }],
    },
    {
      code: 'React.createElement(MyComponent, { style: "mySpecialStyle" })',
      options: [{ allow: ['MyComponent'] }],
    },
  ]),
  invalid: parsers.all([
    {
      code: '<div style="color: \'red\'" />',
      errors: [
        {
          messageId: 'stylePropNotObject',
          line: 1,
          column: 6,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: '<Hello style="color: \'red\'" />',
      errors: [
        {
          messageId: 'stylePropNotObject',
          line: 1,
          column: 8,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: '<div style={true} />',
      errors: [
        {
          messageId: 'stylePropNotObject',
          line: 1,
          column: 6,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: `
        const styles = 'color: "red"';
        function redDiv2() {
          return <div style={styles} />;
        }
      `,
      errors: [
        {
          messageId: 'stylePropNotObject',
          line: 4,
          column: 30,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        const styles = 'color: "red"';
        function redDiv2() {
          return <Hello style={styles} />;
        }
      `,
      errors: [
        {
          messageId: 'stylePropNotObject',
          line: 4,
          column: 32,
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        const styles = true;
        function redDiv() {
          return <div style={styles} />;
        }
      `,
      errors: [
        {
          messageId: 'stylePropNotObject',
          line: 4,
          column: 30,
          type: 'Identifier',
        },
      ],
    },
    {
      code: '<MyComponent style="myStyle" />',
      options: [{ allow: ['MyOtherComponent'] }],
      errors: [
        {
          messageId: 'stylePropNotObject',
          line: 1,
          column: 14,
          type: 'JSXAttribute',
        },
      ],
    },
    {
      code: 'React.createElement(MyComponent, { style: "mySpecialStyle" })',
      options: [{ allow: ['MyOtherComponent'] }],
      errors: [
        {
          messageId: 'stylePropNotObject',
          line: 1,
          column: 43,
          type: 'Literal',
        },
      ],
    },
  ]),
});
