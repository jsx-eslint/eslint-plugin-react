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
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('display-name', rule, {

  valid: [{
    code: `
      var Hello = createReactClass({
        displayName: 'Hello',
        render: function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    options: [{
      ignoreTranspilerName: true
    }]
  }, {
    code: `
      var Hello = React.createClass({
        displayName: 'Hello',
        render: function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    settings: {
      react: {
        createClass: 'createClass'
      }
    }
  }, {
    code: `
      class Hello extends React.Component {
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
      Hello.displayName = 'Hello'
    `,
    options: [{
      ignoreTranspilerName: true
    }]
  }, {
    code: `
      class Hello {
        render() {
          return 'Hello World';
        }
      }
    `
  }, {
    code: `
      class Hello extends Greetings {
        static text = 'Hello World';
        render() {
          return Hello.text;
        }
      }
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      class Hello {
        method;
      }
    `,
    parser: parsers.BABEL_ESLINT
  }, {
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
    options: [{
      ignoreTranspilerName: true
    }]
  }, {
    code: `
      class Hello extends React.Component {
        static displayName = 'Widget';
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      var Hello = createReactClass({
        render: function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `
  }, {
    code: `
      class Hello extends React.Component {
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      export default class Hello {
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      var Hello;
      Hello = createReactClass({
        render: function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `
  }, {
    code: `
      module.exports = createReactClass({
        "displayName": "Hello",
        "render": function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `
  }, {
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
    options: [{
      ignoreTranspilerName: true
    }]
  }, {
    code: `
      export default class {
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      var Hello = function() {
        return <div>Hello {this.props.name}</div>;
      }
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      function Hello() {
        return <div>Hello {this.props.name}</div>;
      }
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      var Hello = () => {
        return <div>Hello {this.props.name}</div>;
      }
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      module.exports = function Hello() {
        return <div>Hello {this.props.name}</div>;
      }
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      function Hello() {
        return <div>Hello {this.props.name}</div>;
      }
      Hello.displayName = 'Hello';
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      var Hello = () => {
        return <div>Hello {this.props.name}</div>;
      }
      Hello.displayName = 'Hello';
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      var Hello = function() {
        return <div>Hello {this.props.name}</div>;
      }
      Hello.displayName = 'Hello';
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    parser: parsers.BABEL_ESLINT
  }, {
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
    options: [{
      ignoreTranspilerName: true
    }],
    parser: parsers.BABEL_ESLINT
  }, {
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
    parser: parsers.BABEL_ESLINT
  }, {
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
    options: [{
      ignoreTranspilerName: true
    }],
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      const Mixin = {
        Button() {
          return (
            <button />
          );
        }
      };
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      var obj = {
        pouf: function() {
          return any
        }
      };
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      var obj = {
        pouf: function() {
          return any
        }
      };
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      export default {
        renderHello() {
          let {name} = this.props;
          return <div>{name}</div>;
        }
      };
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      import React, { createClass } from 'react';
      export default createClass({
        displayName: 'Foo',
        render() {
          return <h1>foo</h1>;
        }
      });
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    settings: {
      react: {
        createClass: 'createClass'
      }
    },
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      import React, {Component} from "react";
      function someDecorator(ComposedComponent) {
        return class MyDecorator extends Component {
          render() {return <ComposedComponent {...this.props} />;}
        };
      }
      module.exports = someDecorator;
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'import React, {createElement} from "react";',
      'const SomeComponent = (props) => {',
      '  const {foo, bar} = props;',
      '  return someComponentFactory({',
      '    onClick: () => foo(bar("x"))',
      '  });',
      '};'
    ].join('\n')
  }, {
    code: [
      'import React, {createElement} from "react";',
      'const SomeComponent = (props) => {',
      '  const {foo, bar} = props;',
      '  return someComponentFactory({',
      '    onClick: () => foo(bar("x"))',
      '  });',
      '};'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: [
      'import React, {Component} from "react";',
      'function someDecorator(ComposedComponent) {',
      '  return class MyDecorator extends Component {',
      '    render() {return <ComposedComponent {...this.props} />;}',
      '  };',
      '}',
      'module.exports = someDecorator;'
    ].join('\n')
  }, {
    code: [
      'import React, {Component} from "react";',
      'function someDecorator(ComposedComponent) {',
      '  return class MyDecorator extends Component {',
      '    render() {return <ComposedComponent {...this.props} />;}',
      '  };',
      '}',
      'module.exports = someDecorator;'
    ].join('\n'),
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      const element = (
        <Media query={query} render={() => {
          renderWasCalled = true
          return <div/>
        }}/>
      )
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      const element = (
        <Media query={query} render={function() {
          renderWasCalled = true
          return <div/>
        }}/>
      )
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      module.exports = {
        createElement: tagName => document.createElement(tagName)
      };
    `,
    parser: parsers.BABEL_ESLINT
  }, {
    code: `
      const { createElement } = document;
      createElement("a");
    `,
    parser: parsers.BABEL_ESLINT
  }, {
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
    `
  }, {
    code: `
      import React from 'react'

      const ComponentWithMemo = React.memo(function Component({ world }) {
        return <div>Hello {world}</div>
      })
    `
  }, {
    code: `
      import React from 'react'

      const ForwardRefComponentLike = React.forwardRef(function ComponentLike({ world }, ref) {
        return <div ref={ref}>Hello {world}</div>
      })
    `
  }, {
    code: `
      function F() {
        let items = [];
        let testData = [{a: "test1", displayName: "test2"}, {a: "test1", displayName: "test2"}];
        for (let item of testData) {
            items.push({a: item.a, b: item.displayName});
        }
        return <div>{items}</div>;
      }
    `
  }, {
    code: `
      import {Component} from "react";
      type LinkProps = {...{}};
      class Link extends Component<LinkProps> {}
    `,
    parser: parsers.BABEL_ESLINT
  }],

  invalid: [{
    code: `
      var Hello = createReactClass({
        render: function() {
          return React.createElement("div", {}, "text content");
        }
      });
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      var Hello = React.createClass({
        render: function() {
          return React.createElement("div", {}, "text content");
        }
      });
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    settings: {
      react: {
        createClass: 'createClass'
      }
    },
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        render: function() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      }
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
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
    options: [{
      ignoreTranspilerName: true
    }],
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      module.exports = () => {
        return <div>Hello {props.name}</div>;
      }
    `,
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      module.exports = function() {
        return <div>Hello {props.name}</div>;
      }
    `,
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      module.exports = createReactClass({
        render() {
          return <div>Hello {this.props.name}</div>;
        }
      });
    `,
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
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
    options: [{
      ignoreTranspilerName: true
    }],
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
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
    options: [{
      ignoreTranspilerName: true
    }],
    parser: parsers.BABEL_ESLINT,
    settings: {
      react: {
        pragma: 'Foo',
        createClass: 'createClass'
      }
    },
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
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
    options: [{
      ignoreTranspilerName: true
    }],
    settings: {
      react: {
        createClass: 'createClass'
      }
    },
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      const Mixin = {
        Button() {
          return (
            <button />
          );
        }
      };
    `,
    options: [{
      ignoreTranspilerName: true
    }],
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      function Hof() {
        return function () {
          return <div />
        }
      }
    `,
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      import React, { createElement } from "react";
      export default (props) => {
        return createElement("div", {}, "hello");
      };
    `,
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      import React from 'react'

      const ComponentWithMemo = React.memo(({ world }) => {
        return <div>Hello {world}</div>
      })
    `,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      import React from 'react'

      const ComponentWithMemo = React.memo(function() {
        return <div>Hello {world}</div>
      })
    `,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      import React from 'react'

      const ForwardRefComponentLike = React.forwardRef(({ world }, ref) => {
        return <div ref={ref}>Hello {world}</div>
      })
    `,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      import React from 'react'

      const ForwardRefComponentLike = React.forwardRef(function({ world }, ref) {
        return <div ref={ref}>Hello {world}</div>
      })
    `,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    // Only trigger an error for the outer React.memo
    code: `
      import React from 'react'

      const MemoizedForwardRefComponentLike = React.memo(
        React.forwardRef(({ world }, ref) => {
          return <div ref={ref}>Hello {world}</div>
        })
      )
    `,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    // Only trigger an error for the outer React.memo
    code: `
      import React from 'react'

      const MemoizedForwardRefComponentLike = React.memo(
        React.forwardRef(function({ world }, ref) {
          return <div ref={ref}>Hello {world}</div>
       })
      )
    `,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
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
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      import React from "react";
      const { createElement } = React;
      export default (props) => {
        return createElement("div", {}, "hello");
      };
    `,
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
    code: `
      import React from "react";
      const createElement = React.createElement;
      export default (props) => {
        return createElement("div", {}, "hello");
      };
    `,
    parser: parsers.BABEL_ESLINT,
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
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
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
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
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }, {
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
    errors: [{
      message: 'Component definition is missing display name'
    }]
  }]
});
