/**
 * @fileoverview It is not necessary to use arrow function for lifecycle methods
 * @author Tan Nguyen
 */

'use strict';

const semver = require('semver');
const RuleTester = require('eslint').RuleTester;
const eslintPkg = require('eslint/package.json');
const rule = require('../../../lib/rules/no-arrow-function-lifecycle');

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
ruleTester.run('no-arrow-function-lifecycle', rule, {
  valid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          getDefaultProps: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          getInitialState: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          getChildContext: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          getDerivedStateFromProps: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          UNSAFE_componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentDidMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          UNSAFE_componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          shouldComponentUpdate: function() { return true; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          UNSAFE_componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          getSnapshotBeforeUpdate: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentDidUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentDidCatch: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUnmount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDefaultProps() { return {}; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getInitialState() { return {}; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getChildContext() { return {}; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDerivedStateFromProps() { return {}; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillMount() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillMount() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidMount() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          shouldComponentUpdate() { return true; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUpdate() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillUpdate() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getSnapshotBeforeUpdate() { return {}; }
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidUpdate() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidCatch() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUnmount() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDerivedStateFromProps = () => { return {}; } // not a lifecycle method
          static getDerivedStateFromProps() {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        var Hello = createReactClass({
          getDerivedStateFromProps: () => { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        class MyComponent extends React.Component {
          onChange: () => void;
        }
      `,
      features: ['types'],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        var Hello = createReactClass({
          render: () => { return <div />; }
        });
      `,
      errors: [{ message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          getDefaultProps: () => { return {}; },
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'getDefaultProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          getDefaultProps: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          getInitialState: () => { return {}; },
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'getInitialState is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          getInitialState: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          getChildContext: () => { return {}; },
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'getChildContext is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          getChildContext: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillMount: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          UNSAFE_componentWillMount: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'UNSAFE_componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          UNSAFE_componentWillMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentDidMount: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentDidMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          componentDidMount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillReceiveProps: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          UNSAFE_componentWillReceiveProps: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'UNSAFE_componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          UNSAFE_componentWillReceiveProps: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          shouldComponentUpdate: () => { return true; },
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'shouldComponentUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          shouldComponentUpdate: function() { return true; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUpdate: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          UNSAFE_componentWillUpdate: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'UNSAFE_componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          UNSAFE_componentWillUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          getSnapshotBeforeUpdate: () => { return {}; },
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'getSnapshotBeforeUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          getSnapshotBeforeUpdate: function() { return {}; },
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentDidUpdate: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentDidUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          componentDidUpdate: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentDidCatch: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentDidCatch is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          componentDidCatch: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        var Hello = createReactClass({
          componentWillUnmount: () => {},
          render: function() { return <div />; }
        });
      `,
      errors: [{ message: 'componentWillUnmount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        var Hello = createReactClass({
          componentWillUnmount: function() {},
          render: function() { return <div />; }
        });
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [{ message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDefaultProps = () => { return {}; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'getDefaultProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getDefaultProps() { return {}; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getInitialState = () => { return {}; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'getInitialState is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getInitialState() { return {}; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getChildContext = () => { return {}; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'getChildContext is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getChildContext() { return {}; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          static getDerivedStateFromProps = () => { return {}; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'getDerivedStateFromProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          static getDerivedStateFromProps() { return {}; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillMount = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillMount() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillMount = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'UNSAFE_componentWillMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillMount() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidMount = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentDidMount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidMount() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillReceiveProps = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillReceiveProps = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'UNSAFE_componentWillReceiveProps is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillReceiveProps() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          shouldComponentUpdate = () => { return true; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'shouldComponentUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          shouldComponentUpdate() { return true; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUpdate = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUpdate() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillUpdate = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'UNSAFE_componentWillUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          UNSAFE_componentWillUpdate() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getSnapshotBeforeUpdate = () => { return {}; }
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'getSnapshotBeforeUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          getSnapshotBeforeUpdate() { return {}; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidUpdate = (prevProps) => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentDidUpdate is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidUpdate(prevProps) {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidCatch = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentDidCatch is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentDidCatch() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUnmount = () => {}
          render = () => { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { message: 'componentWillUnmount is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
        { message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' },
      ],
      output: `
        class Hello extends React.Component {
          handleEventMethods = () => {}
          componentWillUnmount() {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render = () => <div />
        }
      `,
      features: ['class fields'],
      errors: [{ message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: semver.satisfies(eslintPkg.version, '> 3') ? `
        class Hello extends React.Component {
          render() { return <div />; }
        }
      ` : `
        class Hello extends React.Component {
          render = () => <div />
        }
      `,
    },
    {
      code: `
        class Hello extends React.Component {
          render = () => /*first*/<div />/*second*/
        }
      `,
      features: ['class fields'],
      errors: [{ message: 'render is a React lifecycle method, and should not be an arrow function or in a class field. Use an instance method instead.' }],
      output: semver.satisfies(eslintPkg.version, '> 3') ? `
        class Hello extends React.Component {
          render() { return /*first*/<div />/*second*/; }
        }
      ` : `
        class Hello extends React.Component {
          render = () => /*first*/<div />/*second*/
        }
      `,
    },
  ]),
});
