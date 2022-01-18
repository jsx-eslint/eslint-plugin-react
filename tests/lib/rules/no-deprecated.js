/**
 * @fileoverview Prevent usage of deprecated methods
 * @author Yannick Croissant
 * @author Scott Feeney
 * @author Sergei Startsev
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/no-deprecated');

const parsers = require('../../helpers/parsers');

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

function errorMessage(oldMethod, version, newMethod, refs, extraProps) {
  return (
    Object.assign({
      messageId: 'deprecated',
      data: {
        oldMethod,
        version,
        newMethod: newMethod ? `, use ${newMethod} instead` : '',
        refs: refs ? `, see ${refs}` : '',
      },
    }, extraProps)
  );
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });
ruleTester.run('no-deprecated', rule, {
  valid: parsers.all([
    // Not deprecated
    'var element = React.createElement(\'p\', {}, null);',
    'var clone = React.cloneElement(element);',
    'ReactDOM.render(element, container);',
    'ReactDOM.unmountComponentAtNode(container);',
    'ReactDOM.findDOMNode(instance);',
    'ReactDOMServer.renderToString(element);',
    'ReactDOMServer.renderToStaticMarkup(element);',
    {
      code: `
        var Foo = createReactClass({
          render: function() {}
        })
      `,
    },
    // Non-React
    {
      code: `
        var Foo = createReactClassNonReact({
          componentWillMount: function() {},
          componentWillReceiveProps: function() {},
          componentWillUpdate: function() {}
        });
      `,
    },
    {
      code: `
        var Foo = {
          componentWillMount: function() {},
          componentWillReceiveProps: function() {},
          componentWillUpdate: function() {}
        };
      `,
    },
    {
      code: `
        class Foo {
          constructor() {}
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
    },
    // Deprecated in a later version
    {
      code: 'React.renderComponent()',
      settings: { react: { version: '0.11.0' } },
    },
    {
      code: 'React.createClass()',
      settings: { react: { version: '15.4.0' } },
    },
    {
      code: 'PropTypes',
      settings: { react: { version: '15.4.0' } },
    },
    {
      code: `
        class Foo extends React.Component {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      settings: { react: { version: '16.8.0' } },
    },
    {
      code: `
        import React from "react";

        let { default: defaultReactExport, ...allReactExports } = React;
      `,
    },
  ]),

  invalid: parsers.all([
    {
      code: 'React.renderComponent()',
      errors: [errorMessage('React.renderComponent', '0.12.0', 'React.render')],
    },
    {
      code: 'Foo.renderComponent()',
      settings: { react: { pragma: 'Foo' } },
      errors: [errorMessage('Foo.renderComponent', '0.12.0', 'Foo.render')],
    },
    {
      code: '/** @jsx Foo */ Foo.renderComponent()',
      errors: [errorMessage('Foo.renderComponent', '0.12.0', 'Foo.render')],
    },
    {
      code: 'this.transferPropsTo()',
      errors: [errorMessage('this.transferPropsTo', '0.12.0', 'spread operator ({...})')],
    },
    {
      code: 'React.addons.TestUtils',
      errors: [errorMessage('React.addons.TestUtils', '15.5.0', 'ReactDOM.TestUtils')],
    },
    {
      code: 'React.addons.classSet()',
      errors: [errorMessage('React.addons.classSet', '0.13.0', 'the npm module classnames')],
    },
    {
      code: 'React.render(element, container);',
      errors: [errorMessage('React.render', '0.14.0', 'ReactDOM.render')],
    },
    {
      code: 'React.unmountComponentAtNode(container);',
      errors: [errorMessage('React.unmountComponentAtNode', '0.14.0', 'ReactDOM.unmountComponentAtNode')],
    },
    {
      code: 'React.findDOMNode(instance);',
      errors: [errorMessage('React.findDOMNode', '0.14.0', 'ReactDOM.findDOMNode')],
    },
    {
      code: 'React.renderToString(element);',
      errors: [errorMessage('React.renderToString', '0.14.0', 'ReactDOMServer.renderToString')],
    },
    {
      code: 'React.renderToStaticMarkup(element);',
      errors: [errorMessage('React.renderToStaticMarkup', '0.14.0', 'ReactDOMServer.renderToStaticMarkup')],
    },
    {
      code: 'React.createClass({});',
      errors: [errorMessage('React.createClass', '15.5.0', 'the npm module create-react-class')],
    },
    {
      code: 'Foo.createClass({});',
      settings: { react: { pragma: 'Foo' } },
      errors: [errorMessage('Foo.createClass', '15.5.0', 'the npm module create-react-class')],
    },
    {
      code: 'React.PropTypes',
      errors: [errorMessage('React.PropTypes', '15.5.0', 'the npm module prop-types')],
    },
    {
      code: 'var {createClass} = require(\'react\');',
      errors: [errorMessage('React.createClass', '15.5.0', 'the npm module create-react-class')],
    },
    {
      code: 'var {createClass, PropTypes} = require(\'react\');',
      errors: [
        errorMessage('React.createClass', '15.5.0', 'the npm module create-react-class'),
        errorMessage('React.PropTypes', '15.5.0', 'the npm module prop-types'),
      ],
    },
    {
      code: 'import {createClass} from \'react\';',
      errors: [errorMessage('React.createClass', '15.5.0', 'the npm module create-react-class')],
    },
    {
      code: 'import {createClass, PropTypes} from \'react\';',
      errors: [
        errorMessage('React.createClass', '15.5.0', 'the npm module create-react-class'),
        errorMessage('React.PropTypes', '15.5.0', 'the npm module prop-types'),
      ],
    },
    {
      code: `
      import React from 'react';
      const {createClass, PropTypes} = React;
    `,
      errors: [
        errorMessage('React.createClass', '15.5.0', 'the npm module create-react-class'),
        errorMessage('React.PropTypes', '15.5.0', 'the npm module prop-types'),
      ],
    },
    {
      code: 'import {printDOM} from \'react-addons-perf\';',
      errors: [errorMessage('ReactPerf.printDOM', '15.0.0', 'ReactPerf.printOperations')],
    },
    {
      code: `
        import ReactPerf from 'react-addons-perf';
        const {printDOM} = ReactPerf;
      `,
      errors: [errorMessage('ReactPerf.printDOM', '15.0.0', 'ReactPerf.printOperations')],
    },
    {
      code: 'React.DOM.div',
      errors: [errorMessage('React.DOM', '15.6.0', 'the npm module react-dom-factories')],
    },
    {
      code: `
        class Bar extends React.PureComponent {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        };
      `,
      errors: [
        errorMessage(
          'componentWillMount',
          '16.9.0',
          'UNSAFE_componentWillMount',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 3, column: 11 }
        ),
        errorMessage(
          'componentWillReceiveProps',
          '16.9.0',
          'UNSAFE_componentWillReceiveProps',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 4, column: 11 }
        ),
        errorMessage(
          'componentWillUpdate',
          '16.9.0',
          'UNSAFE_componentWillUpdate',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 5, column: 11 }
        ),
      ],
    },
    {
      code: `
        function Foo() {
          return class Bar extends React.PureComponent {
            componentWillMount() {}
            componentWillReceiveProps() {}
            componentWillUpdate() {}
          };
        }
      `,
      errors: [
        errorMessage(
          'componentWillMount',
          '16.9.0',
          'UNSAFE_componentWillMount',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 4, column: 13 }
        ),
        errorMessage(
          'componentWillReceiveProps',
          '16.9.0',
          'UNSAFE_componentWillReceiveProps',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 5, column: 13 }
        ),
        errorMessage(
          'componentWillUpdate',
          '16.9.0',
          'UNSAFE_componentWillUpdate',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 6, column: 13 }
        ),
      ],
    },
    {
      code: `
        class Bar extends PureComponent {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        };
      `,
      errors: [
        errorMessage(
          'componentWillMount',
          '16.9.0',
          'UNSAFE_componentWillMount',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 3, column: 11 }
        ),
        errorMessage(
          'componentWillReceiveProps',
          '16.9.0',
          'UNSAFE_componentWillReceiveProps',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 4, column: 11 }
        ),
        errorMessage(
          'componentWillUpdate',
          '16.9.0',
          'UNSAFE_componentWillUpdate',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 5, column: 11 }
        ),
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      errors: [
        errorMessage(
          'componentWillMount',
          '16.9.0',
          'UNSAFE_componentWillMount',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 3, column: 11 }
        ),
        errorMessage(
          'componentWillReceiveProps',
          '16.9.0',
          'UNSAFE_componentWillReceiveProps',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 4, column: 11 }
        ),
        errorMessage(
          'componentWillUpdate',
          '16.9.0',
          'UNSAFE_componentWillUpdate',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 5, column: 11 }
        ),
      ],
    },
    {
      code: `
        class Foo extends Component {
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      errors: [
        errorMessage(
          'componentWillMount',
          '16.9.0',
          'UNSAFE_componentWillMount',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 3, column: 11 }
        ),
        errorMessage(
          'componentWillReceiveProps',
          '16.9.0',
          'UNSAFE_componentWillReceiveProps',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 4, column: 11 }
        ),
        errorMessage(
          'componentWillUpdate',
          '16.9.0',
          'UNSAFE_componentWillUpdate',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 5, column: 11 }
        ),
      ],
    },
    {
      code: `
        var Foo = createReactClass({
          componentWillMount: function() {},
          componentWillReceiveProps: function() {},
          componentWillUpdate: function() {}
        })
      `,
      errors: [
        errorMessage(
          'componentWillMount',
          '16.9.0',
          'UNSAFE_componentWillMount',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 3, column: 11 }
        ),
        errorMessage(
          'componentWillReceiveProps',
          '16.9.0',
          'UNSAFE_componentWillReceiveProps',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 4, column: 11 }
        ),
        errorMessage(
          'componentWillUpdate',
          '16.9.0',
          'UNSAFE_componentWillUpdate',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 5, column: 11 }
        ),
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor() {}
          componentWillMount() {}
          componentWillReceiveProps() {}
          componentWillUpdate() {}
        }
      `,
      errors: [
        errorMessage(
          'componentWillMount',
          '16.9.0',
          'UNSAFE_componentWillMount',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillmount. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 4, column: 11 }
        ),
        errorMessage(
          'componentWillReceiveProps',
          '16.9.0',
          'UNSAFE_componentWillReceiveProps',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 5, column: 11 }
        ),
        errorMessage(
          'componentWillUpdate',
          '16.9.0',
          'UNSAFE_componentWillUpdate',
          'https://reactjs.org/docs/react-component.html#unsafe_componentwillupdate. Use https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles to automatically update your components.',
          { type: 'Identifier', line: 6, column: 11 }
        ),
      ],
    },
  ]),
});
