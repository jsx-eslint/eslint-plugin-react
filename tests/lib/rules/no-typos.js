/**
 * @fileoverview Tests for no-typos
 */

'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-typos');

const parsers = require('../../helpers/parsers');

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

const ruleTester = new RuleTester();
ruleTester.run('no-typos', rule, {
  valid: [].concat({
    code: `
        import createReactClass from 'create-react-class'
        function hello (extra = {}) {
          return createReactClass({
            noteType: 'hello',
            renderItem () {
              return null
            },
            ...extra
          })
        }
    `,
    parser: parsers.TYPESCRIPT_ESLINT,
    parserOptions
  },
  {
    code: `
      class First {
        static PropTypes = {key: "myValue"};
        static ContextTypes = {key: "myValue"};
        static ChildContextTypes = {key: "myValue"};
        static DefaultProps = {key: "myValue"};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: `
      class First {}
      First.PropTypes = {key: "myValue"};
      First.ContextTypes = {key: "myValue"};
      First.ChildContextTypes = {key: "myValue"};
      First.DefaultProps = {key: "myValue"};
    `,
    parserOptions
  }, {
    code: `
      class First extends React.Component {
        static propTypes = {key: "myValue"};
        static contextTypes = {key: "myValue"};
        static childContextTypes = {key: "myValue"};
        static defaultProps = {key: "myValue"};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: `
      class First extends React.Component {}
      First.propTypes = {key: "myValue"};
      First.contextTypes = {key: "myValue"};
      First.childContextTypes = {key: "myValue"};
      First.defaultProps = {key: "myValue"};
    `,
    parserOptions
  }, {
    code: `
      class MyClass {
        propTypes = {key: "myValue"};
        contextTypes = {key: "myValue"};
        childContextTypes = {key: "myValue"};
        defaultProps = {key: "myValue"};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: `
      class MyClass {
        PropTypes = {key: "myValue"};
        ContextTypes = {key: "myValue"};
        ChildContextTypes = {key: "myValue"};
        DefaultProps = {key: "myValue"};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: `
      class MyClass {
        proptypes = {key: "myValue"};
        contexttypes = {key: "myValue"};
        childcontextypes = {key: "myValue"};
        defaultprops = {key: "myValue"};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: `
      class MyClass {
        static PropTypes() {};
        static ContextTypes() {};
        static ChildContextTypes() {};
        static DefaultProps() {};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: `
      class MyClass {
        static proptypes() {};
        static contexttypes() {};
        static childcontexttypes() {};
        static defaultprops() {};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: `
      class MyClass {}
      MyClass.prototype.PropTypes = function() {};
      MyClass.prototype.ContextTypes = function() {};
      MyClass.prototype.ChildContextTypes = function() {};
      MyClass.prototype.DefaultProps = function() {};
    `,
    parserOptions
  }, {
    code: `
      class MyClass {}
      MyClass.PropTypes = function() {};
      MyClass.ContextTypes = function() {};
      MyClass.ChildContextTypes = function() {};
      MyClass.DefaultProps = function() {};
    `,
    parserOptions
  }, {
    code: `
      function MyRandomFunction() {}
      MyRandomFunction.PropTypes = {};
      MyRandomFunction.ContextTypes = {};
      MyRandomFunction.ChildContextTypes = {};
      MyRandomFunction.DefaultProps = {};
    `,
    parserOptions
  }, {
    // This case is currently not supported
    code: `
      class First extends React.Component {}
      First["prop" + "Types"] = {};
      First["context" + "Types"] = {};
      First["childContext" + "Types"] = {};
      First["default" + "Props"] = {};
    `,
    parserOptions
  }, {
    // This case is currently not supported
    code: `
      class First extends React.Component {}
      First["PROP" + "TYPES"] = {};
      First["CONTEXT" + "TYPES"] = {};
      First["CHILDCONTEXT" + "TYPES"] = {};
      First["DEFAULT" + "PROPS"] = {};
    `,
    parserOptions
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
    parserOptions
  }, {
    code: `
      class Hello extends React.Component {
        static getDerivedStateFromProps() { }
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
    parserOptions
  }, {
    code: `
      class Hello extends React.Component {
        "componentDidMount"() { }
        "my-method"() { }
      }
    `,
    parserOptions
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
    parserOptions
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
    parserOptions
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
    parserOptions
  }, {
    // https://github.com/yannickcr/eslint-plugin-react/issues/1353
    code: `
      function test(b) {
        return a.bind(b);
      }
      function a() {}
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.number.isRequired
      }
   `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parserOptions
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
    parserOptions
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
    parserOptions
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
    parserOptions
  }, {
    code: `
      import CustomReact from "react"
      class Component extends React.Component {};
      Component.propTypes = {
        b: CustomReact.PropTypes.string,
      }
   `,
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: `
      import CustomReact from "react"
      class Component extends React.Component {};
      Component.propTypes = {
        b: CustomReact.PropTypes.string,
      }
   `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
  }, {
    code: `
      const fn = (err, res) => {
        const { body: data = {} } = { ...res };
        data.time = data.time || {};
      };
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `class Component extends React.Component {};
     Component.propTypes = {
       b: string.isRequired,
       c: PropTypes.shape({
         d: number.isRequired,
       }).isRequired
     }
   `,
    parserOptions
  }, {
    code: `class Component extends React.Component {};
     Component.propTypes = {
       b: string.isRequired,
       c: PropTypes.shape({
         d: number.isRequired,
       }).isRequired
     }
   `,
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parserOptions
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
    parser: parsers.BABEL_ESLINT,
    parserOptions
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
    parserOptions
  }, {
    code: `
      import React from 'react';

      const A = { B: 'C' };

      export default class MyComponent extends React.Component {
        [A.B] () {
          return null
        }
      }
    `,
    parserOptions
  }),

  invalid: [].concat({
    code: `
      class Component extends React.Component {
        static PropTypes = {};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp', type: 'Identifier'}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.PropTypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp', type: 'Identifier'}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.PropTypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp', type: 'Identifier'}]
  }, {
    code: `
      class Component extends React.Component {
        static proptypes = {};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.proptypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.proptypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      class Component extends React.Component {
        static ContextTypes = {};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp', type: 'Identifier'}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.ContextTypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.ContextTypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      class Component extends React.Component {
        static contexttypes = {};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.contexttypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.contexttypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      class Component extends React.Component {
        static ChildContextTypes = {};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.ChildContextTypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.ChildContextTypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      class Component extends React.Component {
        static childcontexttypes = {};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.childcontexttypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.childcontexttypes = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      class Component extends React.Component {
        static DefaultProps = {};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp', type: 'Identifier'}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.DefaultProps = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp', type: 'Identifier'}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.DefaultProps = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp', type: 'Identifier'}]
  }, {
    code: `
      class Component extends React.Component {
        static defaultprops = {};
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      class Component extends React.Component {}
      Component.defaultprops = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      function MyComponent() { return (<div>{this.props.myProp}</div>) }
      MyComponent.defaultprops = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      Component.defaultprops = {}
      class Component extends React.Component {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
  }, {
    code: `
      /** @extends React.Component */
      class MyComponent extends BaseComponent {}
      MyComponent.PROPTYPES = {}
    `,
    parserOptions,
    errors: [{messageId: 'typoStaticClassProp'}]
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
    parserOptions,
    errors: [{
      messageId: 'typoLifecycleMethod',
      data: {actual: 'GetDerivedStateFromProps', expected: 'getDerivedStateFromProps'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillMount', expected: 'componentWillMount'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'UNSAFE_ComponentWillMount', expected: 'UNSAFE_componentWillMount'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentDidMount', expected: 'componentDidMount'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillReceiveProps', expected: 'componentWillReceiveProps'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'UNSAFE_ComponentWillReceiveProps', expected: 'UNSAFE_componentWillReceiveProps'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ShouldComponentUpdate', expected: 'shouldComponentUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillUpdate', expected: 'componentWillUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'UNSAFE_ComponentWillUpdate', expected: 'UNSAFE_componentWillUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'GetSnapshotBeforeUpdate', expected: 'getSnapshotBeforeUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentDidUpdate', expected: 'componentDidUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentDidCatch', expected: 'componentDidCatch'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillUnmount', expected: 'componentWillUnmount'},
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
    parserOptions,
    errors: [{
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Getderivedstatefromprops', expected: 'getDerivedStateFromProps'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Componentwillmount', expected: 'componentWillMount'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'UNSAFE_Componentwillmount', expected: 'UNSAFE_componentWillMount'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Componentdidmount', expected: 'componentDidMount'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Componentwillreceiveprops', expected: 'componentWillReceiveProps'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'UNSAFE_Componentwillreceiveprops', expected: 'UNSAFE_componentWillReceiveProps'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Shouldcomponentupdate', expected: 'shouldComponentUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Componentwillupdate', expected: 'componentWillUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'UNSAFE_Componentwillupdate', expected: 'UNSAFE_componentWillUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Getsnapshotbeforeupdate', expected: 'getSnapshotBeforeUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Componentdidupdate', expected: 'componentDidUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Componentdidcatch', expected: 'componentDidCatch'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Componentwillunmount', expected: 'componentWillUnmount'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'Render', expected: 'render'},
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
    parserOptions,
    errors: [{
      messageId: 'typoLifecycleMethod',
      data: {actual: 'getderivedstatefromprops', expected: 'getDerivedStateFromProps'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'componentwillmount', expected: 'componentWillMount'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'unsafe_componentwillmount', expected: 'UNSAFE_componentWillMount'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'componentdidmount', expected: 'componentDidMount'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'componentwillreceiveprops', expected: 'componentWillReceiveProps'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'unsafe_componentwillreceiveprops', expected: 'UNSAFE_componentWillReceiveProps'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'shouldcomponentupdate', expected: 'shouldComponentUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'componentwillupdate', expected: 'componentWillUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'unsafe_componentwillupdate', expected: 'UNSAFE_componentWillUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'getsnapshotbeforeupdate', expected: 'getSnapshotBeforeUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'componentdidupdate', expected: 'componentDidUpdate'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'componentdidcatch', expected: 'componentDidCatch'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'componentwillunmount', expected: 'componentWillUnmount'},
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
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'Number'}
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
          a: PropTypes.number.isrequired
      }
    `,
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'Number'}
    }]
  }, {
    code: `
      import PropTypes from "prop-types";
      class Component extends React.Component {};
      Component.propTypes = {
          a: PropTypes.Number
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'Number'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'String'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }, {
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }, {
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }, {
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }, {
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }]
  }, {
    code: `
     import 'react';
     class Component extends React.Component {};
   `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'noReactBinding'
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }, {
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }, {
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }, {
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }, {
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }, {
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
    }, {
      messageId: 'typoPropTypeChain',
      data: {name: 'isrequired'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropType',
      data: {name: 'bools'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'Array'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'function'}
    }, {
      messageId: 'typoPropType',
      data: {name: 'objectof'}
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
    parserOptions,
    errors: [{
      messageId: 'typoPropDeclaration',
      type: 'Identifier'
    }, {
      messageId: 'typoPropDeclaration',
      type: 'Identifier'
    }, {
      messageId: 'typoPropDeclaration',
      type: 'Identifier'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillMount', expected: 'componentWillMount'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentDidMount', expected: 'componentDidMount'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillReceiveProps', expected: 'componentWillReceiveProps'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ShouldComponentUpdate', expected: 'shouldComponentUpdate'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillUpdate', expected: 'componentWillUpdate'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentDidUpdate', expected: 'componentDidUpdate'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillUnmount', expected: 'componentWillUnmount'},
      type: 'Property'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        getDerivedStateFromProps() { }
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'staticLifecycleMethod',
      data: {method: 'getDerivedStateFromProps'},
      type: 'MethodDefinition'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        GetDerivedStateFromProps() { }
      }
    `,
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'staticLifecycleMethod',
      data: {method: 'GetDerivedStateFromProps'},
      type: 'MethodDefinition'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'GetDerivedStateFromProps', expected: 'getDerivedStateFromProps'},
      type: 'MethodDefinition'
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
    parser: parsers.BABEL_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'typoPropDeclaration',
      type: 'Identifier'
    }, {
      messageId: 'typoPropDeclaration',
      type: 'Identifier'
    }, {
      messageId: 'typoPropDeclaration',
      type: 'Identifier'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillMount', expected: 'componentWillMount'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentDidMount', expected: 'componentDidMount'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillReceiveProps', expected: 'componentWillReceiveProps'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ShouldComponentUpdate', expected: 'shouldComponentUpdate'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillUpdate', expected: 'componentWillUpdate'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentDidUpdate', expected: 'componentDidUpdate'},
      type: 'Property'
    }, {
      messageId: 'typoLifecycleMethod',
      data: {actual: 'ComponentWillUnmount', expected: 'componentWillUnmount'},
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
  }, parsers.TS([{
    code: `
      import 'prop-types'
    `,
    parser: parsers.TYPESCRIPT_ESLINT,
    parserOptions,
    errors: [{
      messageId: 'noPropTypesBinding'
    }]
  }, {
    code: `
      import 'prop-types'
    `,
    parser: parsers['@TYPESCRIPT_ESLINT'],
    parserOptions,
    errors: [{
      messageId: 'noPropTypesBinding'
    }]
  }]))
});
