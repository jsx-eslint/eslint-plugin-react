/**
 * @fileoverview Tests for forbid-foreign-prop-types
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/forbid-foreign-prop-types');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('forbid-foreign-prop-types', rule, {
  valid: parsers.all([
    {
      code: 'import { propTypes } from "SomeComponent";',
    },
    {
      code: 'import { propTypes as someComponentPropTypes } from "SomeComponent";',
    },
    {
      code: 'const foo = propTypes',
    },
    {
      code: 'foo(propTypes)',
    },
    {
      code: 'foo + propTypes',
    },
    {
      code: 'const foo = [propTypes]',
    },
    {
      code: 'const foo = { propTypes }',
    },
    {
      code: 'Foo.propTypes = propTypes',
    },
    {
      code: 'Foo["propTypes"] = propTypes',
    },
    {
      code: 'const propTypes = "bar"; Foo[propTypes];',
    },
    {
      code: `
        const Message = (props) => (<div>{props.message}</div>);
        Message.propTypes = {
          message: PropTypes.string
        };
        const Hello = (props) => (<Message>Hello {props.name}</Message>);
        Hello.propTypes = {
          name: Message.propTypes.message
        };
      `,
      options: [{ allowInPropTypes: true }],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static propTypes = {
            baz: Qux.propTypes.baz
          };
        }
      `,
      features: ['class fields'],
      options: [{ allowInPropTypes: true }],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Foo = createReactClass({
          propTypes: Bar.propTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        var Foo = createReactClass({
          propTypes: Bar["propTypes"],
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          type: 'Literal',
        },
      ],
    },
    {
      code: `
        var { propTypes } = SomeComponent
        var Foo = createReactClass({
          propTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          type: 'Property',
        },
      ],
    },
    {
      code: `
        var { propTypes: things, ...foo } = SomeComponent
        var Foo = createReactClass({
          propTypes,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          type: 'Property',
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static fooBar = {
            baz: Qux.propTypes.baz
          };
        }
      `,
      features: ['class fields', 'no-ts'], // TODO: FIXME: remove "no-ts" and fix
      errors: [
        {
          messageId: 'forbiddenPropType',
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        var { propTypes: typesOfProps } = SomeComponent
        var Foo = createReactClass({
          propTypes: typesOfProps,
          render: function() {
            return <Foo className="bar" />;
          }
        });
      `,
      errors: [
        {
          messageId: 'forbiddenPropType',
          type: 'Property',
        },
      ],
    },
    {
      code: `
        const Message = (props) => (<div>{props.message}</div>);
        Message.propTypes = {
          message: PropTypes.string
        };
        const Hello = (props) => (<Message>Hello {props.name}</Message>);
        Hello.propTypes = {
          name: Message.propTypes.message
        };
      `,
      options: [{ allowInPropTypes: false }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          type: 'Identifier',
        },
      ],
    },
    {
      code: `
        class MyComponent extends React.Component {
          static propTypes = {
            baz: Qux.propTypes.baz
          };
        }
      `,
      features: ['class fields', 'no-ts'], // TODO: FIXME: remove "no-ts" and fix
      options: [{ allowInPropTypes: false }],
      errors: [
        {
          messageId: 'forbiddenPropType',
          type: 'Identifier',
        },
      ],
    },
  ]),
});
