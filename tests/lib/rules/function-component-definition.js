/**
 * @fileoverview Standardize the way function component get defined
 * @author Stefan Wullems
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/function-component-definition');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const parsers = require('../../helpers/parsers');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('function-component-definition', rule, {
  valid: parsers.all([
    {
      code: `
        class Hello extends React.Component {
          render() { return <div>Hello {this.props.name}</div> }
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() { return <div>Hello {this.props.name}</div> }
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() { return <div>Hello {this.props.name}</div> }
        }
      `,
      options: [{ namedComponents: 'function-expression' }],
    },
    {
      code: 'var Hello = (props) => { return <div/> }',
      options: [{ namedComponents: 'arrow-function' }],
    },
    {
      code: 'function Hello(props) { return <div/> }',
      options: [{ namedComponents: 'function-declaration' }],
    },
    {
      code: 'var Hello = function(props) { return <div/> }',
      options: [{ namedComponents: 'function-expression' }],
    },
    {
      code: 'function Hello() { return function() { return <div/> } }',
      options: [{ unnamedComponents: 'function-expression' }],
    },
    {
      code: 'function Hello() { return () => { return <div/> }}',
      options: [{ unnamedComponents: 'arrow-function' }],
    },
    {
      code: 'var Foo = React.memo(function Foo() { return <p/> })',
      options: [{ namedComponents: 'function-declaration' }],
    },
    {
      // shouldn't trigger this rule since functions stating with a lowercase
      // letter are not considered components
      code: `
        const selectAvatarByUserId = (state, id) => {
          const user = selectUserById(state, id)
          return null
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
    },
    {
      // shouldn't trigger this rule since functions stating with a lowercase
      // letter are not considered components
      code: `
        function ensureValidSourceType(sourceType: string) {
          switch (sourceType) {
            case 'ALBUM':
            case 'PLAYLIST':
              return sourceType;
            default:
              return null;
          }
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: 'function Hello(props: Test) { return <p/> }',
      options: [{ namedComponents: 'function-declaration' }],
      features: ['types'],
    },
    {
      code: 'var Hello = function(props: Test) { return <p/> }',
      options: [{ namedComponents: 'function-expression' }],
      features: ['types'],
    },
    {
      code: 'var Hello = (props: Test) => { return <p/> }',
      options: [{ namedComponents: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: 'var Hello: React.FC<Test> = function(props) { return <p/> }',
      options: [{ namedComponents: 'function-expression' }],
      features: ['types'],
    },
    {
      code: 'var Hello: React.FC<Test> = (props) => { return <p/> }',
      options: [{ namedComponents: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: 'function Hello<Test>(props: Props<Test>) { return <p/> }',
      options: [{ namedComponents: 'function-declaration' }],
      features: ['types'],
    },
    {
      code: 'function Hello<Test extends {}>(props: Props<Test>) { return <p/> }',
      options: [{ namedComponents: 'function-declaration' }],
      features: ['types', 'no-babel'],
    },
    {
      code: 'var Hello = function<Test>(props: Props<Test>) { return <p/> }',
      options: [{ namedComponents: 'function-expression' }],
      features: ['ts'],
    },
    {
      code: 'var Hello = function<Test extends {}>(props: Props<Test>) { return <p/> }',
      options: [{ namedComponents: 'function-expression' }],
      features: ['types', 'no-babel'],
    },
    {
      code: 'var Hello = <Test extends {}>(props: Props<Test>) => { return <p/> }',
      options: [{ namedComponents: 'arrow-function' }],
      features: ['types', 'no-babel'],
    },
    {
      code: 'function wrapper() { return function<Test>(props: Props<Test>) { return <p/> } } ',
      options: [{ unnamedComponents: 'function-expression' }],
      features: ['types'],
    },
    {
      code: 'function wrapper() { return function<Test extends {}>(props: Props<Test>) { return <p/> } } ',
      options: [{ unnamedComponents: 'function-expression' }],
      features: ['types', 'no-babel'],
    },
    {
      code: 'function wrapper() { return<Test extends {}>(props: Props<Test>) => { return <p/> } } ',
      options: [{ unnamedComponents: 'arrow-function' }],
      features: ['types', 'no-babel'],
    },
    {
      code: 'var Hello = function(props): ReactNode { return <p/> }',
      options: [{ namedComponents: 'function-expression' }],
      features: ['types'],
    },
    {
      code: 'var Hello = (props): ReactNode => { return <p/> }',
      options: [{ namedComponents: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: 'function wrapper() { return function(props): ReactNode { return <p/> } }',
      options: [{ unnamedComponents: 'function-expression' }],
      features: ['types'],
    },
    {
      code: 'function wrapper() { return (props): ReactNode => { return <p/> } }',
      options: [{ unnamedComponents: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: 'function Hello(props): ReactNode { return <p/> }',
      options: [{ namedComponents: 'function-declaration' }],
      features: ['types'],
    },
    // https://github.com/yannickcr/eslint-plugin-react/issues/2765
    {
      code: `
        const obj = {
          serialize: (el) => {
            return <p/>
          }
        };
      `,
      options: [{ namedComponents: 'function-declaration' }],
    },
    {
      code: `
        const obj = {
          serialize: (el) => {
            return <p/>
          }
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
    },
    {
      code: `
        const obj = {
          serialize: (el) => {
            return <p/>
          }
        }
      `,
      options: [{ namedComponents: 'function-expression' }],
    },
    {
      code: `
        const obj = {
          serialize: function (el) {
            return <p/>
          }
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
    },
    {
      code: `
        const obj = {
          serialize: function (el) {
            return <p/>
          }
        };
      `,
      options: [{ namedComponents: 'arrow-function' }],
    },
    {
      code: `
        const obj = {
          serialize: function (el) {
            return <p/>
          }
        };
      `,
      options: [{ namedComponents: 'function-expression' }],
    },
    {
      code: `
        const obj = {
          serialize(el) {
            return <p/>
          }
        };
      `,
      options: [{ namedComponents: 'function-declaration' }],
    },
    {
      code: `
        const obj = {
          serialize(el) {
            return <p/>
          }
        };
      `,
      options: [{ namedComponents: 'arrow-function' }],
    },
    {
      code: `
        const obj = {
          serialize(el) {
            return <p/>
          }
        };
      `,
      options: [{ namedComponents: 'function-expression' }],
    },
    {
      code: `
        const obj = {
          serialize(el) {
            return <p/>
          }
        };
      `,
      options: [{ unnamedComponents: 'arrow-function' }],
    },
    {
      code: `
        const obj = {
          serialize(el) {
            return <p/>
          }
        };
      `,
      options: [{ unnamedComponents: 'function-expression' }],
    },
    {
      code: `
        const obj = {
          serialize: (el) => {
            return <p/>
          }
        };
      `,
      options: [{ unnamedComponents: 'arrow-function' }],
    },
    {
      code: `
        const obj = {
          serialize: (el) => {
            return <p/>
          }
        };
      `,
      options: [{ unnamedComponents: 'function-expression' }],
    },
    {
      code: `
        const obj = {
          serialize: function (el) {
            return <p/>
          }
        };
      `,
      options: [{ unnamedComponents: 'arrow-function' }],
    },
    {
      code: `
        const obj = {
          serialize: function (el) {
            return <p/>
          }
        };
      `,
      options: [{ unnamedComponents: 'function-expression' }],
    },

    {
      code: 'function Hello(props) { return <div/> }',
      options: [{ namedComponents: ['function-declaration', 'function-expression'] }],
    },
    {
      code: 'var Hello = function(props) { return <div/> }',
      options: [{ namedComponents: ['function-declaration', 'function-expression'] }],
    },
    {
      code: 'var Foo = React.memo(function Foo() { return <p/> })',
      options: [{ namedComponents: ['function-declaration', 'function-expression'] }],
    },
    {
      code: 'function Hello(props: Test) { return <p/> }',
      options: [{ namedComponents: ['function-declaration', 'function-expression'] }],
      features: ['types'],
    },
    {
      code: 'var Hello = function(props: Test) { return <p/> }',
      options: [{ namedComponents: ['function-expression', 'function-expression'] }],
      features: ['types'],
    },
    {
      code: 'var Hello = (props: Test) => { return <p/> }',
      options: [{ namedComponents: ['arrow-function', 'function-expression'] }],
      features: ['types'],
    },
    {
      code: `
        function wrap(Component) {
          return function(props) {
            return <div><Component {...props}/></div>;
          };
        }
      `,
      options: [{ unnamedComponents: ['arrow-function', 'function-expression'] }],
    },
    {
      code: `
        function wrap(Component) {
          return (props) => {
            return <div><Component {...props}/></div>;
          };
        }
      `,
      options: [{ unnamedComponents: ['arrow-function', 'function-expression'] }],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        function Hello(props) {
          return <div/>;
        }
      `,
      output: `
        var Hello = (props) => {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
    },
    {
      code: `
        var Hello = function(props) {
          return <div/>;
        };
      `,
      output: `
        var Hello = (props) => {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
    },
    {
      code: `
        var Hello = (props) => {
          return <div/>;
        };
      `,
      output: `
        function Hello(props) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
      errors: [{ messageId: 'function-declaration' }],
    },
    {
      code: `
        var Hello = function(props) {
          return <div/>;
        };
      `,
      output: `
        function Hello(props) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
      errors: [{ messageId: 'function-declaration' }],
    },
    {
      code: `
        var Hello = (props) => {
          return <div/>;
        };
      `,
      output: `
        var Hello = function(props) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-expression' }],
      errors: [{ messageId: 'function-expression' }],
    },
    {
      code: `
        function Hello(props) {
          return <div/>;
        }
      `,
      output: `
        var Hello = function(props) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-expression' }],
      errors: [{ messageId: 'function-expression' }],
    },
    {
      code: `
        function wrap(Component) {
          return function(props) {
            return <div><Component {...props}/></div>;
          };
        }
      `,
      output: `
        function wrap(Component) {
          return (props) => {
            return <div><Component {...props}/></div>;
          };
        }
      `,
      errors: [{ messageId: 'arrow-function' }],
      options: [{ unnamedComponents: 'arrow-function' }],
    },
    {
      code: `
        function wrap(Component) {
          return (props) => {
            return <div><Component {...props}/></div>;
          };
        }
      `,
      output: `
        function wrap(Component) {
          return function(props) {
            return <div><Component {...props}/></div>;
          };
        }
      `,
      errors: [{ messageId: 'function-expression' }],
      options: [{ unnamedComponents: 'function-expression' }],
    },
    {
      code: `
        var Hello = (props: Test) => {
          return <div/>;
        };
      `,
      output: `
        function Hello(props: Test) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
      errors: [{ messageId: 'function-declaration' }],
      features: ['types'],
    },
    {
      code: `
        var Hello = function(props: Test) {
          return <div/>;
        };
      `,
      output: `
        function Hello(props: Test) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
      errors: [{ messageId: 'function-declaration' }],
      features: ['types'],
    },
    {
      code: `
        function Hello(props: Test) {
          return <div/>;
        }
      `,
      output: `
        var Hello = (props: Test) => {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: `
        var Hello = function(props: Test) {
          return <div/>;
        }
      `,
      output: `
        var Hello = (props: Test) => {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: `
        function Hello(props: Test) {
          return <div/>;
        }
      `,
      output: `
        var Hello = function(props: Test) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-expression' }],
      errors: [{ messageId: 'function-expression' }],
      features: ['types'],
    },
    {
      code: `
        var Hello = (props: Test) => {
          return <div/>;
        }
      `,
      output: `
        var Hello = function(props: Test) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-expression' }],
      errors: [{ messageId: 'function-expression' }],
      features: ['types'],
    },
    {
      code: `
        var Hello: React.FC<Test> = (props) => {
          return <div/>;
        }
      `,
      output: `
        var Hello: React.FC<Test> = function(props) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-expression' }],
      errors: [{ messageId: 'function-expression' }],
      features: ['types'],
    },
    {
      code: `
        var Hello: React.FC<Test> = function(props) {
          return <div/>;
        }
      `,
      output: `
        var Hello: React.FC<Test> = (props) => {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: `
        var Hello: React.FC<Test> = function(props) {
          return <div/>;
        }
      `,
      output: `
        var Hello: React.FC<Test> = function(props) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
      errors: [{ messageId: 'function-declaration' }],
      features: ['types'],
    },
    {
      code: `
        var Hello: React.FC<Test> = (props) => {
          return <div/>;
        };
      `,
      output: `
        var Hello: React.FC<Test> = (props) => {
          return <div/>;
        };
      `,
      options: [{ namedComponents: 'function-declaration' }],
      errors: [{ messageId: 'function-declaration' }],
      features: ['types'],
    },
    {
      code: `
        function Hello<Test extends {}>(props: Test) {
          return <div/>;
        }
      `,
      output: `
        var Hello = <Test extends {}>(props: Test) => {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
      features: ['types', 'no-babel'],
    },
    {
      code: `
        function Hello<Test>(props: Test) {
          return <div/>;
        }
      `,
      output: `
        function Hello<Test>(props: Test) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: `
        function Hello<Test extends {}>(props: Test) {
          return <div/>;
        }
      `,
      output: `
        var Hello = function<Test extends {}>(props: Test) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-expression' }],
      errors: [{ messageId: 'function-expression' }],
      features: ['types', 'no-babel'],
    },
    {
      code: `
        var Hello = function<Test extends {}>(props: Test) {
          return <div/>;
        };
      `,
      output: `
        function Hello<Test extends {}>(props: Test) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
      errors: [{ messageId: 'function-declaration' }],
      features: ['types', 'no-babel'],
    },
    {
      code: `
        var Hello = <Test extends {}>(props: Test) => {
          return <div/>;
        }
      `,
      output: `
        var Hello = function<Test extends {}>(props: Test) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-expression' }],
      errors: [{ messageId: 'function-expression' }],
      features: ['types', 'no-babel'],
    },
    {
      code: `
        var Hello = function<Test extends {}>(props: Test) {
          return <div/>;
        }
      `,
      output: `
        var Hello = <Test extends {}>(props: Test) => {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
      features: ['types', 'no-babel'],
    },
    {
      code: `
        var Hello = function<Test extends {}>(props: Test) {
          return <div/>;
        }
      `,
      output: `
        function Hello<Test extends {}>(props: Test) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
      errors: [{ messageId: 'function-declaration' }],
      features: ['types', 'no-babel'],
    },
    {
      code: `
        function wrap(Component) {
          return function<Test extends {}>(props) {
            return <div><Component {...props}/></div>
          }
        }
      `,
      output: `
        function wrap(Component) {
          return <Test extends {}>(props) => {
            return <div><Component {...props}/></div>
          }
        }
      `,
      errors: [{ messageId: 'arrow-function' }],
      options: [{ unnamedComponents: 'arrow-function' }],
      features: ['types', 'no-babel'],
    },
    {
      code: `
        function wrap(Component) {
          return function<Test>(props) {
            return <div><Component {...props}/></div>
          }
        }
      `,
      output: `
        function wrap(Component) {
          return function<Test>(props) {
            return <div><Component {...props}/></div>
          }
        }
      `,
      errors: [{ messageId: 'arrow-function' }],
      options: [{ unnamedComponents: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: `
        function wrap(Component) {
          return <Test extends {}>(props) => {
            return <div><Component {...props}/></div>
          }
        }
      `,
      output: `
        function wrap(Component) {
          return function<Test extends {}>(props) {
            return <div><Component {...props}/></div>
          }
        }
      `,
      errors: [{ messageId: 'function-expression' }],
      options: [{ unnamedComponents: 'function-expression' }],
      features: ['types', 'no-babel'],
    },
    {
      code: `
        function wrap(Component) {
          return function(props): ReactNode {
            return <div><Component {...props}/></div>
          }
        }
      `,
      output: `
        function wrap(Component) {
          return (props): ReactNode => {
            return <div><Component {...props}/></div>
          }
        }
      `,
      errors: [{ messageId: 'arrow-function' }],
      options: [{ unnamedComponents: 'arrow-function' }],
      features: ['types'],
    },
    {
      code: `
        function wrap(Component) {
          return (props): ReactNode => {
            return <div><Component {...props}/></div>
          }
        }
      `,
      output: `
        function wrap(Component) {
          return function(props): ReactNode {
            return <div><Component {...props}/></div>
          }
        }
      `,
      errors: [{ messageId: 'function-expression' }],
      options: [{ unnamedComponents: 'function-expression' }],
      features: ['types'],
    },
    {
      code: `
        export function Hello(props) {
          return <div/>;
        }
      `,
      output: `
        export var Hello = (props) => {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
    },
    {
      code: `
        export var Hello = function(props) {
          return <div/>;
        }
      `,
      output: `
        export var Hello = (props) => {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
    },
    {
      code: `
        export var Hello = (props) => {
          return <div/>;
        }
      `,
      output: `
        export function Hello(props) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'function-declaration' }],
      errors: [{ messageId: 'function-declaration' }],
    },
    {
      code: `
        export default function Hello(props) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
    },
    {
      code: `
        module.exports = function Hello(props) {
          return <div/>;
        }
      `,
      options: [{ unnamedComponents: 'arrow-function' }],
      errors: [{ messageId: 'arrow-function' }],
    },
    {
      code: `
        function Hello(props) {
          return <div/>;
        }
      `,
      output: `
        var Hello = (props) => {
          return <div/>;
        }
      `,
      options: [{ namedComponents: ['arrow-function', 'function-expression'] }],
      errors: [{ messageId: 'arrow-function' }],
    },
    {
      code: `
        var Hello = (props) => {
          return <div/>;
        };
      `,
      output: `
        function Hello(props) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: ['function-declaration', 'function-expression'] }],
      errors: [{ messageId: 'function-declaration' }],
    },
    {
      code: `
        var Hello = (props) => {
          return <div/>;
        };
      `,
      output: `
        var Hello = function(props) {
          return <div/>;
        }
      `,
      options: [{ namedComponents: ['function-expression', 'function-declaration'] }],
      errors: [{ messageId: 'function-expression' }],
    },
  ]),
});
