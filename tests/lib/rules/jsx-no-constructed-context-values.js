/**
 * @fileoverview Prevents jsx context provider values from taking values that
 *               will cause needless rerenders.
 * @author Dylan Oshima
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/jsx-no-constructed-context-values');

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
ruleTester.run('react-no-constructed-context-values', rule, {
  valid: parsers.all([
    {
      code: '<Context.Provider value={props}></Context.Provider>',
    },
    {
      code: '<Context.Provider value={100}></Context.Provider>',
    },
    {
      code: '<Context.Provider value="Some string"></Context.Provider>',
    },
    {
      code: 'function Component() { const foo = useMemo(() => { return {} }, []); return (<Context.Provider value={foo}></Context.Provider>)}',
      options: [{ allowArrowFunctions: true }],
    },
    {
      code: `
        function Component({oneProp, twoProp, redProp, blueProp,}) {
          return (
            <NewContext.Provider value={twoProp}></NewContext.Provider>
          );
        }
      `,
    },
    {
      code: `
        function Foo(section) {
          const foo = section.section_components?.edges;

          return (
            <Context.Provider value={foo}></Context.Provider>
          )
        }
      `,
      features: ['optional chaining'],
      parserOptions: {
        ecmaVersion: 2020,
      },
    },
    {
      code: `
        import foo from 'foo';
        function innerContext() {
          return (
            <Context.Provider value={foo.something}></Context.Provider>
          )
        }
      `,
    },
    {
      code: `
        // Passes because the lint rule doesn't handle JSX spread attributes
        function innerContext() {
          const foo = {value: 'something'}
          return (
            <Context.Provider {...foo}></Context.Provider>
          )
        }
      `,
    },
    {
      code: `
        // Passes because the lint rule doesn't handle JSX spread attributes
        function innerContext() {
          const foo = useMemo(() => {
            return bar;
          })
          return (
            <Context.Provider value={foo}></Context.Provider>
          )
        }
      `,
    },
    {
      code: `
        // Passes because we can't statically check if it's using the default value
        function Component({ a = {} }) {
          return (<Context.Provider value={a}></Context.Provider>);
        }
      `,
    },
    {
      code: `
          import React from 'react';
          import MyContext from './MyContext';

          const value = '';

          function ContextProvider(props) {
              return (
                  <MyContext.Provider value={value as any}>
                      {props.children}
                  </MyContext.Provider>
              )
          }
        `,
      features: ['types', 'no-babel'],
    },
    {
      code: `
        import React from 'react';
        import BooleanContext from './BooleanContext';

        function ContextProvider(props) {
            return (
                <BooleanContext.Provider value>
                    {props.children}
                </BooleanContext.Provider>
            )
        }
      `,
    },
  ]),
  invalid: parsers.all([
    {
      // Invalid because object construction creates a new identity
      code: 'function Component() { const foo = {}; return (<Context.Provider value={foo}></Context.Provider>) }',
      errors: [{
        messageId: 'withIdentifierMsg',
        data: {
          variableName: 'foo',
          type: 'object',
          nodeLine: '1',
          usageLine: '1',
        },
      }],
    },
    {
      // Invalid because array construction creates a new identity
      code: 'function Component() { const foo = []; return (<Context.Provider value={foo}></Context.Provider>) }',
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'foo',
            type: 'array',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because arrow Function creates a new identity
      code: 'function Component() { const foo = () => {}; return (<Context.Provider value={foo}></Context.Provider>)}',
      errors: [
        {
          messageId: 'withIdentifierMsgFunc',
          data: {
            variableName: 'foo',
            type: 'function expression',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because function expression creates a new identity
      code: 'function Component() { const foo = function bar(){}; return (<Context.Provider value={foo}></Context.Provider>)}',
      errors: [
        {
          messageId: 'withIdentifierMsgFunc',
          data: {
            variableName: 'foo',
            type: 'function expression',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because class expression creates a new identity
      code: 'function Component() { const foo = class SomeClass{}; return (<Context.Provider value={foo}></Context.Provider>)}',
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'foo',
            type: 'class expression',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because new expression creates a new identity
      code: 'function Component() { const foo = new SomeClass(); return (<Context.Provider value={foo}></Context.Provider>)}',
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'foo',
            type: 'new expression',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // // Invalid because function declaration creates a new identity
      code: 'function Component() { function foo() {}; return (<Context.Provider value={foo}></Context.Provider>)}',
      errors: [
        {
          messageId: 'withIdentifierMsgFunc',
          data: {
            variableName: 'foo',
            type: 'function declaration',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because the object value of the ternrary will create a new identity
      code: 'function Component() { const foo = true ? {} : "fine"; return (<Context.Provider value={foo}></Context.Provider>)}',
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'foo',
            type: 'object',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because the object value of the logical OR will create a new identity
      code: 'function Component() { const foo = bar || {}; return (<Context.Provider value={foo}></Context.Provider>)}',
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'foo',
            type: 'object',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because the object value of the logical AND will create a new identity
      code: 'function Component() { const foo = bar && {}; return (<Context.Provider value={foo}></Context.Provider>)}',
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'foo',
            type: 'object',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because the object value of the nested ternary will create a new identity
      code:
        'function Component() { const foo = bar ? baz ? {} : null : null; return (<Context.Provider value={foo}></Context.Provider>)}',
      errors: [{
        messageId: 'withIdentifierMsg',
        data: {
          variableName: 'foo',
          type: 'object',
          nodeLine: '1',
          usageLine: '1',
        },
      }],
    },
    {
      // Invalid because the object value will create a new identity
      code: 'function Component() { let foo = {}; return (<Context.Provider value={foo}></Context.Provider>) }',
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'foo',
            type: 'object',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because the object value will create a new identity
      code: 'function Component() { var foo = {}; return (<Context.Provider value={foo}></Context.Provider>)}',
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'foo',
            type: 'object',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Valid, but currently not handled at the moment.
      code: `
        function Component() {
          let a = {};
          a = 10;
          return (<Context.Provider value={a}></Context.Provider>);
        }
      `,
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'a',
            type: 'object',
            nodeLine: '3',
            usageLine: '5',
          },
        },
      ],
    },
    {
      // Invalid variable reassignment from parameter because bar is an object identity
      code: `
        function Component() {
          const foo = {};
          const bar = foo;
          return (<Context.Provider value={bar}></Context.Provider>);
        }
      `,
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'bar',
            type: 'object',
            nodeLine: '3',
            usageLine: '5',
          },
        },
      ],
    },
    {
      // Invalid because the object expression possibly returned from the ternary will create a new identity
      code: `
        function Component(foo) {
          let bar = true ? foo : {};
          return (<Context.Provider value={bar}></Context.Provider>);
        }
      `,
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'bar',
            type: 'object',
            nodeLine: '3',
            usageLine: '4',
          },
        },
      ],
    },
    {
      // Invalid because inline object construction will create a new identity
      code: 'function Component() { return (<Context.Provider value={{foo: "bar"}}></Context.Provider>);}',
      errors: [
        {
          messageId: 'defaultMsg',
          data: {
            type: 'object',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because Wrapper returns JSX which has a new identity
      code: 'function Component() { const Wrapper = (<SomeComp />); return (<Context.Provider value={Wrapper}></Context.Provider>);}',
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'Wrapper',
            type: 'JSX element',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because RegEx returns a new object which has will be a new identity
      code: 'function Component() { const someRegex = /HelloWorld/; return (<Context.Provider value={someRegex}></Context.Provider>);}',
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'someRegex',
            type: 'regular expression',
            nodeLine: '1',
            usageLine: '1',
          },
        },
      ],
    },
    {
      // Invalid because the right hand side of the assignment expression contains a function which will create a new identity
      code: `
        function Component() {
          let foo = null;
          let bar = x = () => {};
          return (<Context.Provider value={bar}></Context.Provider>);
        }
      `,
      errors: [
        {
          messageId: 'withIdentifierMsg',
          data: {
            variableName: 'bar',
            type: 'assignment expression',
            nodeLine: '4',
            usageLine: '5',
          },
        },
      ],
    },
  ]),
});
