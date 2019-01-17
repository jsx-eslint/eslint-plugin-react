/**
 * @fileoverview Tests for no-typos
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-typos');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  ecmaFeatures: {
    jsx: true
  },
  sourceType: 'module'
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ERROR_MESSAGE = 'Typo in static class property declaration';
const ERROR_MESSAGE_ES5 = 'Typo in property declaration';
const ERROR_MESSAGE_LIFECYCLE_METHOD = 'Typo in component lifecycle method declaration';

const ruleTester = new RuleTester();
ruleTester.run('no-typos', rule, {
  valid: [{
    code: `
      class First {
        static PropTypes = {key: "myValue"};
        static ContextTypes = {key: "myValue"};
        static ChildContextTypes = {key: "myValue"};
        static DefaultProps = {key: "myValue"};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      class First {}
      First.PropTypes = {key: "myValue"};
      First.ContextTypes = {key: "myValue"};
      First.ChildContextTypes = {key: "myValue"};
      First.DefaultProps = {key: "myValue"};
    `,
    parserOptions: parserOptions
  }, {
    code: `
      class First extends React.Component {
        static propTypes = {key: "myValue"};
        static contextTypes = {key: "myValue"};
        static childContextTypes = {key: "myValue"};
        static defaultProps = {key: "myValue"};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      class First extends React.Component {}
      First.propTypes = {key: "myValue"};
      First.contextTypes = {key: "myValue"};
      First.childContextTypes = {key: "myValue"};
      First.defaultProps = {key: "myValue"};
    `,
    parserOptions: parserOptions
  }, {
    code: `
      class MyClass {
        propTypes = {key: "myValue"};
        contextTypes = {key: "myValue"};
        childContextTypes = {key: "myValue"};
        defaultProps = {key: "myValue"};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      class MyClass {
        PropTypes = {key: "myValue"};
        ContextTypes = {key: "myValue"};
        ChildContextTypes = {key: "myValue"};
        DefaultProps = {key: "myValue"};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      class MyClass {
        proptypes = {key: "myValue"};
        contexttypes = {key: "myValue"};
        childcontextypes = {key: "myValue"};
        defaultprops = {key: "myValue"};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      class MyClass {
        static PropTypes() {};
        static ContextTypes() {};
        static ChildContextTypes() {};
        static DefaultProps() {};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      class MyClass {
        static proptypes() {};
        static contexttypes() {};
        static childcontexttypes() {};
        static defaultprops() {};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      class MyClass {}
      MyClass.prototype.PropTypes = function() {};
      MyClass.prototype.ContextTypes = function() {};
      MyClass.prototype.ChildContextTypes = function() {};
      MyClass.prototype.DefaultProps = function() {};
    `,
    parserOptions: parserOptions
  }, {
    code: `
      class MyClass {}
      MyClass.PropTypes = function() {};
      MyClass.ContextTypes = function() {};
      MyClass.ChildContextTypes = function() {};
      MyClass.DefaultProps = function() {};
    `,
    parserOptions: parserOptions
  }, {
    code: `
      function MyRandomFunction() {}
      MyRandomFunction.PropTypes = {};
      MyRandomFunction.ContextTypes = {};
      MyRandomFunction.ChildContextTypes = {};
      MyRandomFunction.DefaultProps = {};
    `,
    parserOptions: parserOptions
  }, {
    // This case is currently not supported
    code: `
      class First extends React.Component {}
      First["prop" + "Types"] = {};
      First["context" + "Types"] = {};
      First["childContext" + "Types"] = {};
      First["default" + "Props"] = {};
    `,
    parserOptions: parserOptions
  }, {
    // This case is currently not supported
    code: `
      class First extends React.Component {}
      First["PROP" + "TYPES"] = {};
      First["CONTEXT" + "TYPES"] = {};
      First["CHILDCONTEXT" + "TYPES"] = {};
      First["DEFAULT" + "PROPS"] = {};
    `,
    parserOptions: parserOptions
  }, {
    code: `
      const propTypes = "PROPTYPES"
      const contextTypes = "CONTEXTTYPES"
      const childContextTypes = "CHILDCONTEXTTYPES"
      const defautProps = "DEFAULTPROPS"

      class First extends React.Component {}
      First[propTypes] = {};
      First[contextTypes] = {};
      First[childContextTypes] = {};
      First[defautProps] = {};
    `,
    parserOptions: parserOptions
  }, {
    code: `
      class Hello extends React.Component {
        componentWillMount() { }
        componentDidMount() { }
        componentWillReceiveProps() { }
        shouldComponentUpdate() { }
        componentWillUpdate() { }
        componentDidUpdate() { }
        componentWillUnmount() { }
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    parserOptions: parserOptions
  }, {
    code: `
      class MyClass {
        componentWillMount() { }
        componentDidMount() { }
        componentWillReceiveProps() { }
        shouldComponentUpdate() { }
        componentWillUpdate() { }
        componentDidUpdate() { }
        componentWillUnmount() { }
        render() { }
      }
    `,
    parserOptions: parserOptions
  }, {
    code: `
      class MyClass {
        componentwillmount() { }
        componentdidmount() { }
        componentwillreceiveprops() { }
        shouldcomponentupdate() { }
        componentwillupdate() { }
        componentdidupdate() { }
        componentwillUnmount() { }
        render() { }
      }
    `,
    parserOptions: parserOptions
  }, {
    code: `
      class MyClass {
        Componentwillmount() { }
        Componentdidmount() { }
        Componentwillreceiveprops() { }
        Shouldcomponentupdate() { }
        Componentwillupdate() { }
        Componentdidupdate() { }
        ComponentwillUnmount() { }
        Render() { }
      }
    `,
    parserOptions: parserOptions
  }, {
    // https://github.com/yannickcr/eslint-plugin-react/issues/1353
    code: `
      function test(b) {
        return a.bind(b);
      }
      function a() {}
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.number.isRequired
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
        e: PropTypes.shape({
          ea: PropTypes.string,
        })
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.string,
        b: PropTypes.string.isRequired,
        c: PropTypes.shape({
          d: PropTypes.string,
          e: PropTypes.number.isRequired,
        }).isRequired
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ])
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.oneOf([
          'hello',
          'hi'
        ])
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: PropTypes.string,
        b: PropTypes.string.isRequired,
        c: PropTypes.shape({
          d: PropTypes.string,
          e: PropTypes.number.isRequired,
        }).isRequired
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.oneOf([
          'hello',
          'hi'
        ])
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: PropTypes.string,
        b: PropTypes.string.isRequired,
        c: PropTypes.shape({
          d: PropTypes.string,
          e: PropTypes.number.isRequired,
        }).isRequired
      }
   `,
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.contextTypes = {
        a: PropTypes.string,
        b: PropTypes.string.isRequired,
        c: PropTypes.shape({
          d: PropTypes.string,
          e: PropTypes.number.isRequired,
        }).isRequired
      }
   `,
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from 'prop-types'
      import * as MyPropTypes from 'lib/my-prop-types'
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.string,
        b: MyPropTypes.MYSTRING,
        c: MyPropTypes.MYSTRING.isRequired,
      }
   `,
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types"
      import * as MyPropTypes from 'lib/my-prop-types'
      class Component extends React.Component {};
      Component.propTypes = {
        b: PropTypes.string,
        a: MyPropTypes.MYSTRING,
      }
   `,
    parserOptions: parserOptions
  }, {
    code: `
      import CustomReact from "react"
      class Component extends React.Component {};
      Component.propTypes = {
        b: CustomReact.PropTypes.string,
      }
   `,
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: PropTypes.string,
        b: PropTypes.string.isRequired,
        c: PropTypes.shape({
          d: PropTypes.string,
          e: PropTypes.number.isRequired,
        }).isRequired
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.contextTypes = {
        a: PropTypes.string,
        b: PropTypes.string.isRequired,
        c: PropTypes.shape({
          d: PropTypes.string,
          e: PropTypes.number.isRequired,
        }).isRequired
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from 'prop-types'
      import * as MyPropTypes from 'lib/my-prop-types'
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.string,
        b: MyPropTypes.MYSTRING,
        c: MyPropTypes.MYSTRING.isRequired,
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import PropTypes from "prop-types"
      import * as MyPropTypes from 'lib/my-prop-types'
      class Component extends React.Component {};
      Component.propTypes = {
        b: PropTypes.string,
        a: MyPropTypes.MYSTRING,
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import CustomReact from "react"
      class Component extends React.Component {};
      Component.propTypes = {
        b: CustomReact.PropTypes.string,
      }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    // ensure that an absent arg to PropTypes.shape does not crash
    code: `class Component extends React.Component {};
     Component.propTypes = {
       a: PropTypes.shape(),
     };
     Component.contextTypes = {
       a: PropTypes.shape(),
     };
    `,
    parserOptions: parserOptions
  }, {
    // ensure that an absent arg to PropTypes.shape does not crash
    code: `class Component extends React.Component {};
     Component.propTypes = {
       a: PropTypes.shape(),
     };
     Component.contextTypes = {
       a: PropTypes.shape(),
     };
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      const fn = (err, res) => {
        const { body: data = {} } = { ...res };
        data.time = data.time || {};
      };
    `,
    parser: 'babel-eslint'
  }, {
    code: `class Component extends React.Component {};
     Component.propTypes = {
       b: string.isRequired,
       c: PropTypes.shape({
         d: number.isRequired,
       }).isRequired
     }
   `,
    parserOptions: parserOptions
  }, {
    code: `class Component extends React.Component {};
     Component.propTypes = {
       b: string.isRequired,
       c: PropTypes.shape({
         d: number.isRequired,
       }).isRequired
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import React from 'react';
      import PropTypes from 'prop-types';
      const Component = React.createReactClass({
        propTypes: {
          a: PropTypes.string.isRequired,
          b: PropTypes.shape({
            c: PropTypes.number
          }).isRequired
        }
      });
    `,
    parserOptions: parserOptions
  }, {
    code: `
      import React from 'react';
      import PropTypes from 'prop-types';
      const Component = React.createReactClass({
        propTypes: {
          a: PropTypes.string.isRequired,
          b: PropTypes.shape({
            c: PropTypes.number
          }).isRequired
        }
      });
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import React from 'react';
      import PropTypes from 'prop-types';
      const Component = React.createReactClass({
        childContextTypes: {
          a: PropTypes.bool,
          b: PropTypes.array,
          c: PropTypes.func,
          d: PropTypes.object,
        }
      });
    `,
    parserOptions: parserOptions
  }, {
    code: `
      import React from 'react';
      import PropTypes from 'prop-types';
      const Component = React.createReactClass({
        childContextTypes: {
          a: PropTypes.bool,
          b: PropTypes.array,
          c: PropTypes.func,
          d: PropTypes.object,
        }
      });
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import React from 'react';
      const Component = React.createReactClass({
        propTypes: {},
        childContextTypes: {},
        contextTypes: {},
        componentWillMount() { },
        componentDidMount() { },
        componentWillReceiveProps() { },
        shouldComponentUpdate() { },
        componentWillUpdate() { },
        componentDidUpdate() { },
        componentWillUnmount() { },
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    parserOptions: parserOptions
  }, {
    code: `
      import React from 'react';
      const Component = React.createReactClass({
        propTypes: {},
        childContextTypes: {},
        contextTypes: {},
        componentWillMount() { },
        componentDidMount() { },
        componentWillReceiveProps() { },
        shouldComponentUpdate() { },
        componentWillUpdate() { },
        componentDidUpdate() { },
        componentWillUnmount() { },
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      import { string, element } from "prop-types";

      class Sample extends React.Component {
         render() { return null; }
      }

      Sample.propTypes = {
        title: string.isRequired,
        body: element.isRequired
      };
    `,
    parserOptions: parserOptions
  }],

  invalid: [{
    code: `
      class Component extends React.Component {
        static PropTypes = {};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.PropTypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.PropTypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {
        static proptypes = {};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.proptypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.proptypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {
        static ContextTypes = {};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.ContextTypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.ContextTypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {
        static contexttypes = {};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.contexttypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.contexttypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {
        static ChildContextTypes = {};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.ChildContextTypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.ChildContextTypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {
        static childcontexttypes = {};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.childcontexttypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.childcontexttypes = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {
        static DefaultProps = {};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.DefaultProps = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.DefaultProps = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {
        static defaultprops = {};
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.defaultprops = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.defaultprops = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      Component.defaultprops = {}
      class Component extends React.Component {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      /** @extends React.Component */
      class MyComponent extends BaseComponent {}
      MyComponent.PROPTYPES = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      class Hello extends React.Component {
        static GetDerivedStateFromProps()  { }
        ComponentWillMount() { }
        UNSAFE_ComponentWillMount() { }
        ComponentDidMount() { }
        ComponentWillReceiveProps() { }
        UNSAFE_ComponentWillReceiveProps() { }
        ShouldComponentUpdate() { }
        ComponentWillUpdate() { }
        UNSAFE_ComponentWillUpdate() { }
        GetSnapshotBeforeUpdate() { }
        ComponentDidUpdate() { }
        ComponentDidCatch() { }
        ComponentWillUnmount() { }
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        static Getderivedstatefromprops() { }
        Componentwillmount() { }
        UNSAFE_Componentwillmount() { }
        Componentdidmount() { }
        Componentwillreceiveprops() { }
        UNSAFE_Componentwillreceiveprops() { }
        Shouldcomponentupdate() { }
        Componentwillupdate() { }
        UNSAFE_Componentwillupdate() { }
        Getsnapshotbeforeupdate() { }
        Componentdidupdate() { }
        Componentdidcatch() { }
        Componentwillunmount() { }
        Render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        static getderivedstatefromprops() { }
        componentwillmount() { }
        unsafe_componentwillmount() { }
        componentdidmount() { }
        componentwillreceiveprops() { }
        unsafe_componentwillreceiveprops() { }
        shouldcomponentupdate() { }
        componentwillupdate() { }
        unsafe_componentwillupdate() { }
        getsnapshotbeforeupdate() { }
        componentdidupdate() { }
        componentdidcatch() { }
        componentwillunmount() { }
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
          a: PropTypes.Number.isRequired
      }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: Number'
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
          a: PropTypes.number.isrequired
      }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {
        static propTypes = {
          a: PropTypes.number.isrequired
        }
      };
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {
        static propTypes = {
          a: PropTypes.Number
        }
      };
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: Number'
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
          a: PropTypes.Number
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: Number'
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.shape({
          b: PropTypes.String,
          c: PropTypes.number.isRequired,
        })
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: String'
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.oneOfType([
          PropTypes.bools,
          PropTypes.number,
        ])
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.bools,
        b: PropTypes.Array,
        c: PropTypes.function,
        d: PropTypes.objectof,
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: PropTypes.bools,
        b: PropTypes.Array,
        c: PropTypes.function,
        d: PropTypes.objectof,
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
      import PropTypes from 'prop-types';
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: PropTypes.bools,
        b: PropTypes.Array,
        c: PropTypes.function,
        d: PropTypes.objectof,
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
     import PropTypes from 'prop-types';
     class Component extends React.Component {};
     Component.propTypes = {
       a: PropTypes.string.isrequired,
       b: PropTypes.shape({
         c: PropTypes.number
       }).isrequired
     }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }, {
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
     import PropTypes from 'prop-types';
     class Component extends React.Component {};
     Component.propTypes = {
       a: PropTypes.string.isrequired,
       b: PropTypes.shape({
         c: PropTypes.number
       }).isrequired
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }, {
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
      import RealPropTypes from 'prop-types';
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: RealPropTypes.bools,
        b: RealPropTypes.Array,
        c: RealPropTypes.function,
        d: RealPropTypes.objectof,
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
     import React from 'react';
     class Component extends React.Component {};
     Component.propTypes = {
       a: React.PropTypes.string.isrequired,
       b: React.PropTypes.shape({
         c: React.PropTypes.number
       }).isrequired
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }, {
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
      import React from 'react';
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: React.PropTypes.bools,
        b: React.PropTypes.Array,
        c: React.PropTypes.function,
        d: React.PropTypes.objectof,
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
     import { PropTypes } from 'react';
     class Component extends React.Component {};
     Component.propTypes = {
       a: PropTypes.string.isrequired,
       b: PropTypes.shape({
         c: PropTypes.number
       }).isrequired
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }, {
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
     import 'react';
     class Component extends React.Component {};
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: []
  }, {
    code: `
      import { PropTypes } from 'react';
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: PropTypes.bools,
        b: PropTypes.Array,
        c: PropTypes.function,
        d: PropTypes.objectof,
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
      import PropTypes from 'prop-types';
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: PropTypes.bools,
        b: PropTypes.Array,
        c: PropTypes.function,
        d: PropTypes.objectof,
      }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
     import PropTypes from 'prop-types';
     class Component extends React.Component {};
     Component.propTypes = {
       a: PropTypes.string.isrequired,
       b: PropTypes.shape({
         c: PropTypes.number
       }).isrequired
     }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }, {
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
     import PropTypes from 'prop-types';
     class Component extends React.Component {};
     Component.propTypes = {
       a: PropTypes.string.isrequired,
       b: PropTypes.shape({
         c: PropTypes.number
       }).isrequired
     }
   `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }, {
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
      import RealPropTypes from 'prop-types';
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: RealPropTypes.bools,
        b: RealPropTypes.Array,
        c: RealPropTypes.function,
        d: RealPropTypes.objectof,
      }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
     import React from 'react';
     class Component extends React.Component {};
     Component.propTypes = {
       a: React.PropTypes.string.isrequired,
       b: React.PropTypes.shape({
         c: React.PropTypes.number
       }).isrequired
     }
   `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }, {
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
      import React from 'react';
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: React.PropTypes.bools,
        b: React.PropTypes.Array,
        c: React.PropTypes.function,
        d: React.PropTypes.objectof,
      }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
     import { PropTypes } from 'react';
     class Component extends React.Component {};
     Component.propTypes = {
       a: PropTypes.string.isrequired,
       b: PropTypes.shape({
         c: PropTypes.number
       }).isrequired
     }
   `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }, {
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
      import { PropTypes } from 'react';
      class Component extends React.Component {};
      Component.childContextTypes = {
        a: PropTypes.bools,
        b: PropTypes.Array,
        c: PropTypes.function,
        d: PropTypes.objectof,
      }
    `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
      import React from 'react';
      import PropTypes from 'prop-types';
      const Component = React.createReactClass({
        propTypes: {
          a: PropTypes.string.isrequired,
          b: PropTypes.shape({
            c: PropTypes.number
          }).isrequired
        }
      });
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }, {
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
      import React from 'react';
      import PropTypes from 'prop-types';
      const Component = React.createReactClass({
        childContextTypes: {
          a: PropTypes.bools,
          b: PropTypes.Array,
          c: PropTypes.function,
          d: PropTypes.objectof,
        }
      });
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
      import React from 'react';
      import PropTypes from 'prop-types';
      const Component = React.createReactClass({
        propTypes: {
          a: PropTypes.string.isrequired,
          b: PropTypes.shape({
            c: PropTypes.number
          }).isrequired
        }
      });
    `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }, {
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `
      import React from 'react';
      import PropTypes from 'prop-types';
      const Component = React.createReactClass({
        childContextTypes: {
          a: PropTypes.bools,
          b: PropTypes.Array,
          c: PropTypes.function,
          d: PropTypes.objectof,
        }
      });
    `,
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `
      import React from 'react';
      const Component = React.createReactClass({
        proptypes: {},
        childcontexttypes: {},
        contexttypes: {},
        ComponentWillMount() { },
        ComponentDidMount() { },
        ComponentWillReceiveProps() { },
        ShouldComponentUpdate() { },
        ComponentWillUpdate() { },
        ComponentDidUpdate() { },
        ComponentWillUnmount() { },
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE_ES5,
      type: 'ObjectExpression'
    }, {
      message: ERROR_MESSAGE_ES5,
      type: 'ObjectExpression'
    }, {
      message: ERROR_MESSAGE_ES5,
      type: 'ObjectExpression'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }]
  }, {
    code: `
      import React from 'react';
      const Component = React.createReactClass({
        proptypes: {},
        childcontexttypes: {},
        contexttypes: {},
        ComponentWillMount() { },
        ComponentDidMount() { },
        ComponentWillReceiveProps() { },
        ShouldComponentUpdate() { },
        ComponentWillUpdate() { },
        ComponentDidUpdate() { },
        ComponentWillUnmount() { },
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE_ES5,
      type: 'ObjectExpression'
    }, {
      message: ERROR_MESSAGE_ES5,
      type: 'ObjectExpression'
    }, {
      message: ERROR_MESSAGE_ES5,
      type: 'ObjectExpression'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'Property'
    }]
    /*
    // PropTypes declared on a component that is detected through JSDoc comments and is
    // declared AFTER the PropTypes assignment
    // Commented out since it only works with ESLint 5.
      ,{
        code: `
          MyComponent.PROPTYPES = {}
          \/** @extends React.Component *\/
          class MyComponent extends BaseComponent {}
        `,
        parserOptions: parserOptions
      },
    */
  }]
});
