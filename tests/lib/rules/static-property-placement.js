/**
 * @fileoverview Defines where React component static properties should be positioned.
 * @author Daniel Mason
 */

'use strict';

// ------------------------------------------------------------------------------
// Positioning Options
// ------------------------------------------------------------------------------
const STATIC_PUBLIC_FIELD = 'static public field';
const STATIC_GETTER = 'static getter';
const PROPERTY_ASSIGNMENT = 'property assignment';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/static-property-placement');

const parsers = require('../../helpers/parsers');

const ruleTesterConfig = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: '15',
    },
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester(ruleTesterConfig);
ruleTester.run('static-property-placement', rule, {
  valid: parsers.all([
    // ------------------------------------------------------------------------------
    // Ignore creatClass/createReactClass and Static Functional Components
    // ------------------------------------------------------------------------------
    {
      // Do not error on createReactClass pragma
      code: `
        var MyComponent = createReactClass({
          childContextTypes: {
            something: PropTypes.bool
          },

          contextTypes: {
            something: PropTypes.bool
          },

          getDefaultProps: function() {
            name: 'Bob'
          },

          displayName: 'Hello',

          propTypes: {
            something: PropTypes.bool
          },

          render: function() {
            return null;
          },
        });
      `,
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error on createClass pragma
      code: `
        var MyComponent = React.createClass({
          childContextTypes: {
            something: PropTypes.bool
          },

          contextTypes: {
            something: PropTypes.bool
          },

          getDefaultProps: function() {
            name: 'Bob'
          },

          displayName: 'Hello',

          propTypes: {
            something: PropTypes.bool
          },

          render: function() {
            return null;
          },
        });
      `,
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error on SFC arrow function with return
      code: `
        const MyComponent = () => {
            return <div>Hello</div>;
        };

        MyComponent.childContextTypes = {
          something: PropTypes.bool
        };

        MyComponent.contextTypes = {
          something: PropTypes.bool
        };

        MyComponent.defaultProps = {
          something: 'Bob'
        };

        MyComponent.displayName = 'Hello';

        MyComponent.propTypes = {
          something: PropTypes.bool
        };
      `,
    },
    {
      // Do not error on SFC arrow function with direct return
      code: `
        const MyComponent = () => (<div>Hello</div>);

        MyComponent.childContextTypes = {
          something: PropTypes.bool
        };

        MyComponent.contextTypes = {
          something: PropTypes.bool
        };

        MyComponent.defaultProps = {
          something: 'Bob'
        };

        MyComponent.displayName = 'Hello';

        MyComponent.propTypes = {
          something: PropTypes.bool
        };
      `,
    },
    {
      // Do not error on SFC as unnamed function
      code: `
        export function MyComponent () {
            return <div>Hello</div>;
        };

        MyComponent.childContextTypes = {
          something: PropTypes.bool
        };

        MyComponent.contextTypes = {
          something: PropTypes.bool
        };

        MyComponent.defaultProps = {
          something: 'Bob'
        };

        MyComponent.displayName = 'Hello';

        MyComponent.propTypes = {
          something: PropTypes.bool
        };
      `,
    },

    {
      // Do not error on non-component classes #2884
      code: `
        class Foo {
          static get propTypes() {}
        }
      `,
    },

    {
      // Do not error on non-component classes #2884
      code: `
        class Foo {
          static propTypes = {}
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT],
    },

    // ------------------------------------------------------------------------------
    // no properties
    // ------------------------------------------------------------------------------
    {
      // Do not error if no properties defined
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }
      `,
    },
    {
      // Do not error if unchecked properties defined
      code: `
        class MyComponent extends React.Component {
          static randomlyNamed = {
            name: 'random'
          }
        }
      `,
      features: ['class fields'],
    },
    {
      // Do not error if unchecked static properties defined and assignment rule enabled
      code: `
        class MyComponent extends React.Component {
          static randomlyNamed = {
            name: 'random'
          }
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error if unchecked assignment properties defined and assignment rule enabled
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.randomlyNamed = {
          name: 'random'
        }
      `,
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error if unchecked assignment properties defined and static rule enabled
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.randomlyNamed = {
          name: 'random'
        }
      `,
    },
    // ------------------------------------------------------------------------------
    // childContextTypes - static field
    // ------------------------------------------------------------------------------
    {
      // Do not error if childContextTypes correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
    },
    {
      // Do not error if childContextTypes correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT, { childContextTypes: STATIC_PUBLIC_FIELD }],
    },
    // ------------------------------------------------------------------------------
    // childContextTypes - static getter
    // ------------------------------------------------------------------------------
    {
      // Do not error if childContextTypes correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get childContextTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [STATIC_GETTER],
    },
    {
      // Do not error if contextTypes correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get childContextTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [PROPERTY_ASSIGNMENT, { childContextTypes: STATIC_GETTER }],
    },
    // ------------------------------------------------------------------------------
    // childContextTypes - assignment
    // ------------------------------------------------------------------------------
    {
      // Do not error if childContextTypes correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.childContextTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error if childContextTypes correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.childContextTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [STATIC_PUBLIC_FIELD, { childContextTypes: PROPERTY_ASSIGNMENT }],
    },
    // ------------------------------------------------------------------------------
    // contextTypes - static field
    // ------------------------------------------------------------------------------
    {
      // Do not error if contextTypes correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static contextTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
    },
    {
      // Do not error if contextTypes correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static contextTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT, { contextTypes: STATIC_PUBLIC_FIELD }],
    },
    // ------------------------------------------------------------------------------
    // contextTypes - static getter
    // ------------------------------------------------------------------------------
    {
      // Do not error if contextTypes correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get contextTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [STATIC_GETTER],
    },
    {
      // Do not error if contextTypes correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get contextTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [PROPERTY_ASSIGNMENT, { contextTypes: STATIC_GETTER }],
    },
    // ------------------------------------------------------------------------------
    // contextTypes - assignment
    // ------------------------------------------------------------------------------
    {
      // Do not error if contextTypes correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.contextTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error if contextTypes correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.contextTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [STATIC_PUBLIC_FIELD, { contextTypes: PROPERTY_ASSIGNMENT }],
    },
    // ------------------------------------------------------------------------------
    // contextType - static field
    // ------------------------------------------------------------------------------
    {
      // Do not error if contextType correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static contextType = MyContext;
        }
      `,
      features: ['class fields'],
    },
    {
      // Do not error if contextType correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static contextType = MyContext;
        }
      `,
      options: [PROPERTY_ASSIGNMENT, { contextType: STATIC_PUBLIC_FIELD }],
      features: ['class fields'],
    },
    // ------------------------------------------------------------------------------
    // contextType - static getter
    // ------------------------------------------------------------------------------
    {
      // Do not error if contextType correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static get contextType() {
             return MyContext;
          }
        }
      `,
      options: [STATIC_GETTER],
    },
    {
      // Do not error if contextType correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static get contextType() {
             return MyContext;
          }
        }
      `,
      options: [PROPERTY_ASSIGNMENT, { contextType: STATIC_GETTER }],
    },
    // ------------------------------------------------------------------------------
    // contextType - assignment
    // ------------------------------------------------------------------------------
    {
      // Do not error if contextType correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.contextType = MyContext;
      `,
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error if contextType correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.contextType = MyContext;
      `,
      options: [STATIC_PUBLIC_FIELD, { contextType: PROPERTY_ASSIGNMENT }],
    },
    // ------------------------------------------------------------------------------
    // displayName - static field
    // ------------------------------------------------------------------------------
    {
      // Do not error if displayName correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static displayName = "Hello";
        }
      `,
      features: ['class fields'],
    },
    {
      // Do not error if displayName correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static displayName = "Hello";
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT, { displayName: STATIC_PUBLIC_FIELD }],
    },
    // ------------------------------------------------------------------------------
    // displayName - static getter
    // ------------------------------------------------------------------------------
    {
      // Do not error if displayName correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get displayName() {
            return "Hello";
          }
        }
      `,
      options: [STATIC_GETTER],
    },
    {
      // Do not error if contextTypes correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get displayName() {
            return "Hello";
          }
        }
      `,
      options: [PROPERTY_ASSIGNMENT, { displayName: STATIC_GETTER }],
    },
    // ------------------------------------------------------------------------------
    // displayName - assignment
    // ------------------------------------------------------------------------------
    {
      // Do not error if displayName correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.displayName = "Hello";
      `,
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error if displayName correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.displayName = "Hello";
      `,
      options: [STATIC_PUBLIC_FIELD, { displayName: PROPERTY_ASSIGNMENT }],
    },
    // ------------------------------------------------------------------------------
    // defaultProps - static field
    // ------------------------------------------------------------------------------
    {
      // Do not error if defaultProps correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static defaultProps = {
            something: 'Bob'
          };
        }
      `,
      features: ['class fields'],
    },
    {
      // Do not error if defaultProps correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static defaultProps = {
            something: 'Bob'
          };
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT, { defaultProps: STATIC_PUBLIC_FIELD }],
    },
    // ------------------------------------------------------------------------------
    // defaultProps - static getter
    // ------------------------------------------------------------------------------
    {
      // Do not error if defaultProps correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get defaultProps() {
            return {
              something: 'Bob'
            };
          }
        }
      `,
      options: [STATIC_GETTER],
    },
    {
      // Do not error if contextTypes correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get defaultProps() {
            return {
              something: 'Bob'
            };
          }
        }
      `,
      options: [PROPERTY_ASSIGNMENT, { defaultProps: STATIC_GETTER }],
    },
    // ------------------------------------------------------------------------------
    // defaultProps - assignment
    // ------------------------------------------------------------------------------
    {
      // Do not error if defaultProps correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.defaultProps = {
          name: 'Bob'
        }
      `,
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error if defaultProps correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.defaultProps = {
          name: 'Bob'
        }
      `,
      options: [STATIC_PUBLIC_FIELD, { defaultProps: PROPERTY_ASSIGNMENT }],
    },
    // ------------------------------------------------------------------------------
    // propTypes - static field
    // ------------------------------------------------------------------------------
    {
      // Do not error if propTypes correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static propTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
    },
    {
      // Do not error if propTypes correctly defined - static field
      code: `
        class MyComponent extends React.Component {
          static propTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT, { propTypes: STATIC_PUBLIC_FIELD }],
    },
    // ------------------------------------------------------------------------------
    // propTypes - static getter
    // ------------------------------------------------------------------------------
    {
      // Do not error if propTypes correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get propTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [STATIC_GETTER],
    },
    {
      // Do not error if contextTypes correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get propTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [PROPERTY_ASSIGNMENT, { propTypes: STATIC_GETTER }],
    },
    // ------------------------------------------------------------------------------
    // propTypes - assignment
    // ------------------------------------------------------------------------------
    {
      // Do not error if propTypes correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error if propTypes correctly defined - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [STATIC_PUBLIC_FIELD, { propTypes: PROPERTY_ASSIGNMENT }],
    },
    // ------------------------------------------------------------------------------
    // multiple - static field
    // ------------------------------------------------------------------------------
    {
      // Do not error if multiple properties and match config - static field
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };

          static contextTypes = {
            something: PropTypes.bool
          };

          static contextType = MyContext;

          static displayName = "Hello";

          static defaultProps = {
            something: 'Bob'
          };

          static propTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
    },
    {
      // Do not error if multiple properties and match config - static field
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };

          static contextTypes = {
            something: PropTypes.bool
          };

          static contextType = MyContext;

          static displayName = "Hello";

          static defaultProps = {
            something: 'Bob'
          };

          static propTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT, {
        childContextTypes: STATIC_PUBLIC_FIELD,
        contextTypes: STATIC_PUBLIC_FIELD,
        contextType: STATIC_PUBLIC_FIELD,
        displayName: STATIC_PUBLIC_FIELD,
        defaultProps: STATIC_PUBLIC_FIELD,
        propTypes: STATIC_PUBLIC_FIELD,
      }],
    },
    // ------------------------------------------------------------------------------
    // multiple - static getter
    // ------------------------------------------------------------------------------
    {
      // Do not error if childContextTypes correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get childContextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextType() {
            return MyContext;
          }

          static get displayName() {
            return "Hello";
          }

          static get defaultProps() {
            return {
              something: PropTypes.bool
            };
          }

          static get propTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [STATIC_GETTER],
    },
    {
      // Do not error if contextTypes correctly defined - static getter
      code: `
        class MyComponent extends React.Component {
          static get childContextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextType() {
            return MyContext;
          }

          static get displayName() {
            return "Hello";
          }

          static get defaultProps() {
            return {
              something: PropTypes.bool
            };
          }

          static get propTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [PROPERTY_ASSIGNMENT, {
        childContextTypes: STATIC_GETTER,
        contextTypes: STATIC_GETTER,
        contextType: STATIC_GETTER,
        displayName: STATIC_GETTER,
        defaultProps: STATIC_GETTER,
        propTypes: STATIC_GETTER,
      }],
    },
    // ------------------------------------------------------------------------------
    // multiple - assignment
    // ------------------------------------------------------------------------------
    {
      // Do not error if multiple properties and match config - assignment
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.childContextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.displayName = "Hello";

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [PROPERTY_ASSIGNMENT],
    },
    {
      // Do not error if multiple properties and match config - static field
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.childContextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.displayName = "Hello";

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [STATIC_PUBLIC_FIELD, {
        childContextTypes: PROPERTY_ASSIGNMENT,
        contextTypes: PROPERTY_ASSIGNMENT,
        displayName: PROPERTY_ASSIGNMENT,
        defaultProps: PROPERTY_ASSIGNMENT,
        propTypes: PROPERTY_ASSIGNMENT,
      }],
    },
    // ------------------------------------------------------------------------------
    // combined - mixed
    // ------------------------------------------------------------------------------
    {
      // Do not error if mixed property positions and match config
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static get displayName() {
            return "Hello"
          }
        }

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      features: ['class fields'],
      options: [STATIC_PUBLIC_FIELD, {
        displayName: STATIC_GETTER,
        defaultProps: PROPERTY_ASSIGNMENT,
        propTypes: PROPERTY_ASSIGNMENT,
      }],
    },
    {
      // Do not error if mixed property positions and match config
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static get displayName() {
            return "Hello"
          }
        }

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT, {
        childContextTypes: STATIC_PUBLIC_FIELD,
        contextTypes: STATIC_PUBLIC_FIELD,
        displayName: STATIC_GETTER,
      }],
    },
    // ------------------------------------------------------------------------------
    // mixed component types
    // ------------------------------------------------------------------------------
    {
      // SFC ignored and component is valid
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static displayName = "Hello";
        }

        const OtherComponent = () => (<div>Hello</div>);

        OtherComponent.defaultProps = {
          name: 'Bob'
        }

        OtherComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      features: ['class fields'],
    },
    {
      // Multiple components validated
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static displayName = "Hello";
        }

        class OtherComponent extends React.Component {
          static defaultProps = {
            name: 'Bob'
          }

          static propTypes = {
            name: PropTypes.string.isRequired
          }
        }
      `,
      features: ['class fields'],
    },
    // ------------------------------------------------------------------------------
    // edge cases
    // ------------------------------------------------------------------------------
    {
      // Do not error if property assignment is inside a class function
      code: `
        class MyComponent extends React.Component {
          static displayName = "Hello";

          myMethod() {
            console.log(MyComponent.displayName);
          }
        }
      `,
      features: ['class fields'],
      options: [STATIC_PUBLIC_FIELD],
    },
    {
      // Do not error if display name value changed
      code: `
        class MyComponent extends React.Component {
          static displayName = "Hello";

          myMethod() {
            MyComponent.displayName = "Bonjour";
          }
        }
      `,
      features: ['class fields'],
      options: [STATIC_PUBLIC_FIELD],
    },
  ]),

  invalid: parsers.all([
    // ------------------------------------------------------------------------------
    // expected static field when got property assigment
    // ------------------------------------------------------------------------------
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.childContextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextType = MyContext;

        MyComponent.displayName = "Hello";

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      errors: [
        {
          messageId: 'notStaticClassProp',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'contextType' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'displayName' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'propTypes' },
        },
      ],
    },
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.childContextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextType = MyContext;

        MyComponent.displayName = "Hello";

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [PROPERTY_ASSIGNMENT, {
        childContextTypes: STATIC_PUBLIC_FIELD,
        contextTypes: STATIC_PUBLIC_FIELD,
        contextType: STATIC_PUBLIC_FIELD,
        displayName: STATIC_PUBLIC_FIELD,
        defaultProps: STATIC_PUBLIC_FIELD,
        propTypes: STATIC_PUBLIC_FIELD,
      }],
      errors: [
        {
          messageId: 'notStaticClassProp',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'contextType' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'displayName' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'propTypes' },
        },
      ],
    },
    // ------------------------------------------------------------------------------
    // expected static field when got static getter
    // ------------------------------------------------------------------------------
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          static get childContextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextType() {
            return MyContext;
          }

          static get displayName() {
            return "Hello";
          }

          static get defaultProps() {
            return {
              something: PropTypes.bool
            };
          }

          static get propTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      errors: [
        {
          messageId: 'notStaticClassProp',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'contextType' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'displayName' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'propTypes' },
        },
      ],
    },
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          static get childContextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextType() {
            return MyContext;
          }

          static get displayName() {
            return "Hello";
          }

          static get defaultProps() {
            return {
              something: PropTypes.bool
            };
          }

          static get propTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [
        PROPERTY_ASSIGNMENT,
        {
          childContextTypes: STATIC_PUBLIC_FIELD,
          contextTypes: STATIC_PUBLIC_FIELD,
          contextType: STATIC_PUBLIC_FIELD,
          displayName: STATIC_PUBLIC_FIELD,
          defaultProps: STATIC_PUBLIC_FIELD,
          propTypes: STATIC_PUBLIC_FIELD,
        },
      ],
      errors: [
        {
          messageId: 'notStaticClassProp',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'contextType' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'displayName' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'propTypes' },
        },
      ],
    },
    // ------------------------------------------------------------------------------
    // expected property assignment when got static field
    // ------------------------------------------------------------------------------
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };

          static contextTypes = {
            something: PropTypes.bool
          };

          static contextType = MyContext;

          static displayName = "Hello";

          static defaultProps = {
            something: 'Bob'
          };

          static propTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT],
      errors: [
        {
          messageId: 'declareOutsideClass',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextType' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'displayName' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'propTypes' },
        },
      ],
    },
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };

          static contextTypes = {
            something: PropTypes.bool
          };

          static contextType = MyContext;

          static displayName = "Hello";

          static defaultProps = {
            something: 'Bob'
          };

          static propTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
      options: [
        STATIC_PUBLIC_FIELD,
        {
          childContextTypes: PROPERTY_ASSIGNMENT,
          contextTypes: PROPERTY_ASSIGNMENT,
          contextType: PROPERTY_ASSIGNMENT,
          displayName: PROPERTY_ASSIGNMENT,
          defaultProps: PROPERTY_ASSIGNMENT,
          propTypes: PROPERTY_ASSIGNMENT,
        },
      ],
      errors: [
        {
          messageId: 'declareOutsideClass',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextType' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'displayName' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'propTypes' },
        },
      ],
    },
    // ------------------------------------------------------------------------------
    // expected property assignment when got static getter
    // ------------------------------------------------------------------------------
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          static get childContextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextType() {
            return MyContext;
          }

          static get displayName() {
            return "Hello";
          }

          static get defaultProps() {
            return {
              something: PropTypes.bool
            };
          }

          static get propTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [PROPERTY_ASSIGNMENT],
      errors: [
        {
          messageId: 'declareOutsideClass',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextType' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'displayName' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'propTypes' },
        },
      ],
    },
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          static get childContextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextTypes() {
            return {
              something: PropTypes.bool
            };
          }

          static get contextType() {
            return MyContext;
          }

          static get displayName() {
            return "Hello";
          }

          static get defaultProps() {
            return {
              something: PropTypes.bool
            };
          }

          static get propTypes() {
            return {
              something: PropTypes.bool
            };
          }
        }
      `,
      options: [
        STATIC_GETTER,
        {
          childContextTypes: PROPERTY_ASSIGNMENT,
          contextTypes: PROPERTY_ASSIGNMENT,
          contextType: PROPERTY_ASSIGNMENT,
          displayName: PROPERTY_ASSIGNMENT,
          defaultProps: PROPERTY_ASSIGNMENT,
          propTypes: PROPERTY_ASSIGNMENT,
        },
      ],
      errors: [
        {
          messageId: 'declareOutsideClass',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextType' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'displayName' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'propTypes' },
        },
      ],
    },
    // ------------------------------------------------------------------------------
    // expected static getter when got static field
    // ------------------------------------------------------------------------------
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };

          static contextTypes = {
            something: PropTypes.bool
          };

          static contextType = MyContext;

          static displayName = "Hello";

          static defaultProps = {
            something: 'Bob'
          };

          static propTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
      options: [STATIC_GETTER],
      errors: [
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'contextType' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'displayName' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'propTypes' },
        },
      ],
    },
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            something: PropTypes.bool
          };

          static contextTypes = {
            something: PropTypes.bool
          };

          static contextType = MyContext;

          static displayName = "Hello";

          static defaultProps = {
            something: 'Bob'
          };

          static propTypes = {
            something: PropTypes.bool
          };
        }
      `,
      features: ['class fields'],
      options: [
        STATIC_PUBLIC_FIELD,
        {
          childContextTypes: STATIC_GETTER,
          contextTypes: STATIC_GETTER,
          contextType: STATIC_GETTER,
          displayName: STATIC_GETTER,
          defaultProps: STATIC_GETTER,
          propTypes: STATIC_GETTER,
        },
      ],
      errors: [
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'contextType' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'displayName' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'propTypes' },
        },
      ],
    },
    // ------------------------------------------------------------------------------
    // expected static getter when got property assignment
    // ------------------------------------------------------------------------------
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.childContextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextType = MyContext;

        MyComponent.displayName = "Hello";

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [STATIC_GETTER],
      errors: [
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'contextType' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'displayName' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'propTypes' },
        },
      ],
    },
    {
      // Error if multiple properties are incorrectly positioned according to config
      code: `
        class MyComponent extends React.Component {
          render() {
            return null;
          }
        }

        MyComponent.childContextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextTypes = {
          name: PropTypes.string.isRequired
        }

        MyComponent.contextType = MyContext;

        MyComponent.displayName = "Hello";

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      options: [
        PROPERTY_ASSIGNMENT,
        {
          childContextTypes: STATIC_GETTER,
          contextTypes: STATIC_GETTER,
          contextType: STATIC_GETTER,
          displayName: STATIC_GETTER,
          defaultProps: STATIC_GETTER,
          propTypes: STATIC_GETTER,
        },
      ],
      errors: [
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'contextType' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'displayName' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'propTypes' },
        },
      ],
    },
    // ------------------------------------------------------------------------------
    // combined - mixed
    // ------------------------------------------------------------------------------
    {
      // Error if mixed property positions but dont match config
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextType = MyContext;

          static get displayName() {
            return "Hello";
          }
        }

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      features: ['class fields'],
      options: [
        PROPERTY_ASSIGNMENT,
        {
          defaultProps: STATIC_GETTER,
          propTypes: STATIC_PUBLIC_FIELD,
          displayName: STATIC_PUBLIC_FIELD,
        },
      ],
      errors: [
        {
          messageId: 'declareOutsideClass',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextType' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'displayName' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'notStaticClassProp',
          data: { name: 'propTypes' },
        },
      ],
    },
    {
      // Error if mixed property positions but dont match config
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextType = MyContext;

          static get displayName() {
            return "Hello";
          }
        }

        MyComponent.defaultProps = {
          name: 'Bob'
        }

        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      features: ['class fields'],
      options: [
        STATIC_GETTER,
        {
          childContextTypes: PROPERTY_ASSIGNMENT,
          contextTypes: PROPERTY_ASSIGNMENT,
          contextType: PROPERTY_ASSIGNMENT,
          displayName: PROPERTY_ASSIGNMENT,
        },
      ],
      errors: [
        {
          messageId: 'declareOutsideClass',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextType' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'displayName' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'notGetterClassFunc',
          data: { name: 'propTypes' },
        },
      ],
    },
    // ------------------------------------------------------------------------------
    // mixed component types
    // ------------------------------------------------------------------------------
    {
      // SFC ignored and component is invalid
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextType = MyContext;

          static get displayName() {
            return "Hello";
          }
        }

        const OtherComponent = () => (<div>Hello</div>);

        OtherComponent.defaultProps = {
          name: 'Bob'
        }

        OtherComponent.propTypes = {
          name: PropTypes.string.isRequired
        }
      `,
      features: ['class fields'],
      options: [
        PROPERTY_ASSIGNMENT,
        {
          defaultProps: STATIC_PUBLIC_FIELD,
          propTypes: STATIC_GETTER,
        },
      ],
      errors: [
        {
          messageId: 'declareOutsideClass',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextType' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'displayName' },
        },
      ],
    },
    {
      // Multiple components validated
      code: `
        class MyComponent extends React.Component {
          static childContextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static contextType = MyContext;

          static displayName = "Hello";
        }

        class OtherComponent extends React.Component {
          static contextTypes = {
            name: PropTypes.string.isRequired
          }

          static defaultProps = {
            name: 'Bob'
          }

          static propTypes = {
            name: PropTypes.string.isRequired
          }

          static get displayName() {
            return "Hello";
          }
        }
      `,
      features: ['class fields'],
      options: [PROPERTY_ASSIGNMENT],
      errors: [
        {
          messageId: 'declareOutsideClass',
          data: { name: 'childContextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextType' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'displayName' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'contextTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'defaultProps' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'propTypes' },
        },
        {
          messageId: 'declareOutsideClass',
          data: { name: 'displayName' },
        },
      ],
    },
  ]),
});
