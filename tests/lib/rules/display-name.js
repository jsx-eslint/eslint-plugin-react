/**
 * @fileoverview Prevent missing displayName in a React component definition
 * @author Yannick Croissant
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/display-name');

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
ruleTester.run('display-name', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
    },
    {
      code: `
        var Hello = React.createClass({
          displayName: 'Hello',
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
      settings: {
        react: {
          createClass: 'createClass',
        },
      },
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
        Hello.displayName = 'Hello'
      `,
      options: [{ ignoreTranspilerName: true }],
    },
    {
      code: `
        class Hello {
          render() {
            return 'Hello World';
          }
        }
      `,
    },
    {
      code: `
        class Hello extends Greetings {
          static text = 'Hello World';
          render() {
            return Hello.text;
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello {
          method;
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          static get displayName() {
            return 'Hello';
          }
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      options: [{ ignoreTranspilerName: true }],
    },
    {
      code: `
        class Hello extends React.Component {
          static displayName = 'Widget';
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      options: [{ ignoreTranspilerName: true }],
      features: ['class fields'],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
    },
    {
      code: `
        export default class Hello {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
    },
    {
      code: `
        var Hello;
        Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        module.exports = createReactClass({
          "displayName": "Hello",
          "render": function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {
            let { a, ...b } = obj;
            let c = { ...d };
            return <div />;
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
    },
    {
      code: `
        export default class {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
    },
    {
      code: `
        export const Hello = React.memo(function Hello() {
          return <p />;
        })
      `,
    },
    {
      code: `
        var Hello = function() {
          return <div>Hello {this.props.name}</div>;
        }
      `,
    },
    {
      code: `
        function Hello() {
          return <div>Hello {this.props.name}</div>;
        }
      `,
    },
    {
      code: `
        var Hello = () => {
          return <div>Hello {this.props.name}</div>;
        }
      `,
    },
    {
      code: `
        module.exports = function Hello() {
          return <div>Hello {this.props.name}</div>;
        }
      `,
    },
    {
      code: `
        function Hello() {
          return <div>Hello {this.props.name}</div>;
        }
        Hello.displayName = 'Hello';
      `,
      options: [{ ignoreTranspilerName: true }],
    },
    {
      code: `
        var Hello = () => {
          return <div>Hello {this.props.name}</div>;
        }
        Hello.displayName = 'Hello';
      `,
      options: [{ ignoreTranspilerName: true }],
    },
    {
      code: `
        var Hello = function() {
          return <div>Hello {this.props.name}</div>;
        }
        Hello.displayName = 'Hello';
      `,
      options: [{ ignoreTranspilerName: true }],
    },
    {
      code: `
        var Mixins = {
          Greetings: {
            Hello: function() {
              return <div>Hello {this.props.name}</div>;
            }
          }
        }
        Mixins.Greetings.Hello.displayName = 'Hello';
      `,
      options: [{ ignoreTranspilerName: true }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>{this._renderHello()}</div>;
          },
          _renderHello: function() {
            return <span>Hello {this.props.name}</span>;
          }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          displayName: 'Hello',
          render: function() {
            return <div>{this._renderHello()}</div>;
          },
          _renderHello: function() {
            return <span>Hello {this.props.name}</span>;
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
    },
    {
      code: `
        const Mixin = {
          Button() {
            return (
              <button />
            );
          }
        };
      `,
    },
    {
      code: `
        var obj = {
          pouf: function() {
            return any
          }
        };
      `,
      options: [{ ignoreTranspilerName: true }],
    },
    {
      code: `
        var obj = {
          pouf: function() {
            return any
          }
        };
      `,
    },
    {
      code: `
        export default {
          renderHello() {
            let {name} = this.props;
            return <div>{name}</div>;
          }
        };
      `,
    },
    {
      code: `
        import React, { createClass } from 'react';
        export default createClass({
          displayName: 'Foo',
          render() {
            return <h1>foo</h1>;
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
      settings: {
        react: {
          createClass: 'createClass',
        },
      },
    },
    {
      code: `
        import React, {Component} from "react";
        function someDecorator(ComposedComponent) {
          return class MyDecorator extends Component {
            render() {return <ComposedComponent {...this.props} />;}
          };
        }
        module.exports = someDecorator;
      `,
    },
    {
      code: `
        import React, {createElement} from "react";
        const SomeComponent = (props) => {
          const {foo, bar} = props;
          return someComponentFactory({
            onClick: () => foo(bar("x"))
          });
        };
      `,
    },
    {
      code: `
        import React, {createElement} from "react";
        const SomeComponent = (props) => {
          const {foo, bar} = props;
          return someComponentFactory({
            onClick: () => foo(bar("x"))
          });
        };
      `,
    },
    {
      code: `
        import React, {Component} from "react";
        function someDecorator(ComposedComponent) {
          return class MyDecorator extends Component {
            render() {return <ComposedComponent {...this.props} />;}
          };
        }
        module.exports = someDecorator;
      `,
    },
    {
      code: `
        import React, {Component} from "react";
        function someDecorator(ComposedComponent) {
          return class MyDecorator extends Component {
            render() {return <ComposedComponent {...this.props} />;}
          };
        }
        module.exports = someDecorator;
      `,
    },
    {
      code: `
        const element = (
          <Media query={query} render={() => {
            renderWasCalled = true
            return <div/>
          }}/>
        )
      `,
    },
    {
      code: `
        const element = (
          <Media query={query} render={function() {
            renderWasCalled = true
            return <div/>
          }}/>
        )
      `,
    },
    {
      code: `
        module.exports = {
          createElement: tagName => document.createElement(tagName)
        };
      `,
    },
    {
      code: `
        const { createElement } = document;
        createElement("a");
      `,
    },
    {
      code: `
        import React from 'react'
        import { string } from 'prop-types'

        function Component({ world }) {
          return <div>Hello {world}</div>
        }

        Component.propTypes = {
          world: string,
        }

        export default React.memo(Component)
      `,
    },
    {
      code: `
        import React from 'react'

        const ComponentWithMemo = React.memo(function Component({ world }) {
          return <div>Hello {world}</div>
        })
      `,
    },
    {
      code: `
        import React from 'react';

        const Hello = React.memo(function Hello() {
          return;
        });
      `,
    },
    {
      code: `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(function ComponentLike({ world }, ref) {
          return <div ref={ref}>Hello {world}</div>
        })
      `,
    },
    {
      code: `
        function F() {
          let items = [];
          let testData = [
            {a: "test1", displayName: "test2"}, {a: "test1", displayName: "test2"}];
          for (let item of testData) {
              items.push({a: item.a, b: item.displayName});
          }
          return <div>{items}</div>;
        }
      `,
    },
    {
      code: `
        import {Component} from "react";
        type LinkProps = {...{}};
        class Link extends Component<LinkProps> {}
      `,
      features: ['flow'],
    },
    {
      code: `
        const x = {
          title: "URL",
          dataIndex: "url",
          key: "url",
          render: url => (
            <a href={url} target="_blank" rel="noopener noreferrer">
              <p>lol</p>
            </a>
          )
        }
      `,
    },
    {
      code: `
        const renderer = a => function Component(listItem) {
          return <div>{a} {listItem}</div>;
        };
      `,
    },
    {
      // issue 3032
      code: `
        const Comp = React.forwardRef((props, ref) => <main />);
        Comp.displayName = 'MyCompName';
      `,
    },
    {
      // issue 3032
      code: `
        const Comp = React.forwardRef((props, ref) => <main data-as="yes" />) as SomeComponent;
        Comp.displayName = 'MyCompNameAs';
      `,
      features: ['ts', 'no-babel'],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return React.createElement("div", {}, "text content");
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
      errors: [
        {
          messageId: 'noDisplayName',
        }],
    },
    {
      code: `
        var Hello = React.createClass({
          render: function() {
            return React.createElement("div", {}, "text content");
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
      settings: {
        react: {
          createClass: 'createClass',
        },
      },
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        var Hello = createReactClass({
          render: function() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        class Hello extends React.Component {
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      options: [{ ignoreTranspilerName: true }],
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        function HelloComponent() {
          return createReactClass({
            render: function() {
              return <div>Hello {this.props.name}</div>;
            }
          });
        }
        module.exports = HelloComponent();
      `,
      options: [{ ignoreTranspilerName: true }],
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        module.exports = () => {
          return <div>Hello {props.name}</div>;
        }
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        module.exports = function() {
          return <div>Hello {props.name}</div>;
        }
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        module.exports = createReactClass({
          render() {
            return <div>Hello {this.props.name}</div>;
          }
        });
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        var Hello = createReactClass({
          _renderHello: function() {
            return <span>Hello {this.props.name}</span>;
          },
          render: function() {
            return <div>{this._renderHello()}</div>;
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        var Hello = Foo.createClass({
          _renderHello: function() {
            return <span>Hello {this.props.name}</span>;
          },
          render: function() {
            return <div>{this._renderHello()}</div>;
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
      settings: {
        react: {
          pragma: 'Foo',
          createClass: 'createClass',
        },
      },
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        /** @jsx Foo */
        var Hello = Foo.createClass({
          _renderHello: function() {
            return <span>Hello {this.props.name}</span>;
          },
          render: function() {
            return <div>{this._renderHello()}</div>;
          }
        });
      `,
      options: [{ ignoreTranspilerName: true }],
      settings: {
        react: {
          createClass: 'createClass',
        },
      },
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        const Mixin = {
          Button() {
            return (
              <button />
            );
          }
        };
      `,
      options: [{ ignoreTranspilerName: true }],
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        function Hof() {
          return function () {
            return <div />
          }
        }
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        import React, { createElement } from "react";
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        import React from 'react'

        const ComponentWithMemo = React.memo(({ world }) => {
          return <div>Hello {world}</div>
        })
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        import React from 'react'

        const ComponentWithMemo = React.memo(function() {
          return <div>Hello {world}</div>
        })
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(({ world }, ref) => {
          return <div ref={ref}>Hello {world}</div>
        })
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        import React from 'react'

        const ForwardRefComponentLike = React.forwardRef(function({ world }, ref) {
          return <div ref={ref}>Hello {world}</div>
        })
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
    // Only trigger an error for the outer React.memo
      code: `
        import React from 'react'

        const MemoizedForwardRefComponentLike = React.memo(
          React.forwardRef(({ world }, ref) => {
            return <div ref={ref}>Hello {world}</div>
          })
        )
      `,
      errors: [
        {
          messageId: 'noDisplayName',
        }],
    },
    {
    // Only trigger an error for the outer React.memo
      code: `
        import React from 'react'

        const MemoizedForwardRefComponentLike = React.memo(
          React.forwardRef(function({ world }, ref) {
            return <div ref={ref}>Hello {world}</div>
        })
        )
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
    // React does not handle the result of forwardRef being passed into memo
    // ComponentWithMemoAndForwardRef gets shown as Memo(Anonymous)
    // See https://github.com/facebook/react/issues/16722
      code: `
        import React from 'react'

        const MemoizedForwardRefComponentLike = React.memo(
          React.forwardRef(function ComponentLike({ world }, ref) {
            return <div ref={ref}>Hello {world}</div>
          })
        )
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        import React from "react";
        const { createElement } = React;
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        import React from "react";
        const createElement = React.createElement;
        export default (props) => {
          return createElement("div", {}, "hello");
        };
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        module.exports = function () {
          function a () {}
          const b = function b () {}
          const c = function () {}
          const d = () => {}
          const obj = {
            a: function a () {},
            b: function b () {},
            c () {},
            d: () => {},
          }
          return React.createElement("div", {}, "text content");
        }
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        module.exports = () => {
          function a () {}
          const b = function b () {}
          const c = function () {}
          const d = () => {}
          const obj = {
            a: function a () {},
            b: function b () {},
            c () {},
            d: () => {},
          }

          return React.createElement("div", {}, "text content");
        }
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        export default class extends React.Component {
          render() {
            function a () {}
            const b = function b () {}
            const c = function () {}
            const d = () => {}
            const obj = {
              a: function a () {},
              b: function b () {},
              c () {},
              d: () => {},
            }
            return <div>Hello {this.props.name}</div>;
          }
        }
      `,
      errors: [{ messageId: 'noDisplayName' }],
    },
    {
      code: `
        export default class extends React.PureComponent {
          render() {
            return <Card />;
          }
        }

        const Card = (() => {
          return React.memo(({ }) => (
            <div />
          ));
        })();
      `,
      errors: [
        {
          messageId: 'noDisplayName',
          line: 2,
          column: 24,
        },
        {
          messageId: 'noDisplayName',
          line: 9,
          column: 18,
        },
      ],
    },
    {
      code: `
        const renderer = a => listItem => (
          <div>{a} {listItem}</div>
        );
      `,
      errors: [
        { message: 'Component definition is missing display name' },
      ],
    },
    {
      code: `
        const processData = (options?: { value: string }) => options?.value || 'no data';

        export const Component = observer(() => {
          const data = processData({ value: 'data' });
          return <div>{data}</div>;
        });
        
        export const Component2 = observer(() => {
          const data = processData();
          return <div>{data}</div>;
        });      
      `,
      features: ['optional chaining', 'types'],
      settings: { componentWrapperFunctions: ['observer'] },
      errors: [
        {
          message: 'Component definition is missing display name',
          line: 4,
        },
        {
          message: 'Component definition is missing display name',
          line: 9,
        },
      ],
    },
  ]),
});
