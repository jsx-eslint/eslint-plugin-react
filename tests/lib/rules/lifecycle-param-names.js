/**
 * @fileoverview Enforce the conventional parameter names of lifecycle methods
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/lifecycle-param-names');

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
ruleTester.run('lifecycle-param-names', rule, {
  valid: parsers.all([
    {
      code: `
        class Foo extends React.Component {
          constructor(props) { super(props); }
          static getDerivedStateFromProps(props, state) { return null; }
          static getDerivedStateFromError(error) { return null; }
          shouldComponentUpdate(nextProps, nextState) { return true; }
          getSnapshotBeforeUpdate(prevProps, prevState) { return null; }
          componentDidUpdate(prevProps, prevState, snapshot) {}
          componentDidCatch(error, info) {}
          UNSAFE_componentWillReceiveProps(nextProps) {}
          UNSAFE_componentWillUpdate(nextProps, nextState) {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          componentWillReceiveProps = (nextProps) => {}
          componentWillUpdate = function (nextProps, nextState) {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Foo extends React.Component {
          componentDidUpdate({ value }, { open }) {}
          shouldComponentUpdate(...args) { return true; }
          getSnapshotBeforeUpdate([a], prevState = {}) { return null; }
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          componentDidUpdate(prevProps) {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        var Foo = createReactClass({
          componentDidUpdate: function (prevProps, prevState) {},
          shouldComponentUpdate(nextProps, nextState) { return true; },
          render: function () { return <div />; }
        });
      `,
    },
    {
      code: `
        class Foo {
          componentDidUpdate(props) {}
          shouldComponentUpdate(prevProps, nextState) {}
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          static componentDidUpdate(props) {}
          getDerivedStateFromProps(nextProps, prevState) { return null; }
          [componentDidUpdate](props) {}
          render() { return <div />; }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component<Props, State> {
          componentDidUpdate(this: Foo, prevProps: Props, prevState: State) {}
          render() { return <div />; }
        }
      `,
      features: ['ts', 'no-babel'],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        class Foo extends Component {
          componentDidUpdate(props) {}
          shouldComponentUpdate(prevProps, nextState) {}
          render() { return <div />; }
        }
      `,
      errors: [
        {
          messageId: 'wrongName',
          data: { name: 'props', method: 'componentDidUpdate', expected: 'prevProps' },
          line: 3,
          column: 30,
        },
        {
          messageId: 'wrongName',
          data: { name: 'prevProps', method: 'shouldComponentUpdate', expected: 'nextProps' },
          line: 4,
          column: 33,
        },
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(nextProps) { super(nextProps); }
          static getDerivedStateFromProps(nextProps, prevState) { return null; }
          static getDerivedStateFromError(err) { return null; }
          getSnapshotBeforeUpdate(props, state) { return null; }
          componentDidUpdate(prevProps, prevState, snap) {}
          componentDidCatch(e, errorInfo) {}
          UNSAFE_componentWillReceiveProps(props) {}
          UNSAFE_componentWillUpdate(props, state) {}
          render() { return <div />; }
        }
      `,
      errors: [
        { messageId: 'wrongName', data: { name: 'nextProps', method: 'constructor', expected: 'props' } },
        { messageId: 'wrongName', data: { name: 'nextProps', method: 'getDerivedStateFromProps', expected: 'props' } },
        { messageId: 'wrongName', data: { name: 'prevState', method: 'getDerivedStateFromProps', expected: 'state' } },
        { messageId: 'wrongName', data: { name: 'err', method: 'getDerivedStateFromError', expected: 'error' } },
        { messageId: 'wrongName', data: { name: 'props', method: 'getSnapshotBeforeUpdate', expected: 'prevProps' } },
        { messageId: 'wrongName', data: { name: 'state', method: 'getSnapshotBeforeUpdate', expected: 'prevState' } },
        { messageId: 'wrongName', data: { name: 'snap', method: 'componentDidUpdate', expected: 'snapshot' } },
        { messageId: 'wrongName', data: { name: 'e', method: 'componentDidCatch', expected: 'error' } },
        { messageId: 'wrongName', data: { name: 'errorInfo', method: 'componentDidCatch', expected: 'info' } },
        { messageId: 'wrongName', data: { name: 'props', method: 'UNSAFE_componentWillReceiveProps', expected: 'nextProps' } },
        { messageId: 'wrongName', data: { name: 'props', method: 'UNSAFE_componentWillUpdate', expected: 'nextProps' } },
        { messageId: 'wrongName', data: { name: 'state', method: 'UNSAFE_componentWillUpdate', expected: 'nextState' } },
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          componentWillReceiveProps = (props) => {}
          componentWillUpdate = function (props, nextState) {}
          render() { return <div />; }
        }
      `,
      features: ['class fields'],
      errors: [
        { messageId: 'wrongName', data: { name: 'props', method: 'componentWillReceiveProps', expected: 'nextProps' } },
        { messageId: 'wrongName', data: { name: 'props', method: 'componentWillUpdate', expected: 'nextProps' } },
      ],
    },
    {
      code: `
        class Foo extends React.Component {
          componentDidUpdate({ value }, state) {}
          render() { return <div />; }
        }
      `,
      errors: [
        { messageId: 'wrongName', data: { name: 'state', method: 'componentDidUpdate', expected: 'prevState' } },
      ],
    },
    {
      code: `
        var Foo = createReactClass({
          componentDidUpdate: function (props) {},
          shouldComponentUpdate(props) { return true; },
          render: function () { return <div />; }
        });
      `,
      errors: [
        { messageId: 'wrongName', data: { name: 'props', method: 'componentDidUpdate', expected: 'prevProps' } },
        { messageId: 'wrongName', data: { name: 'props', method: 'shouldComponentUpdate', expected: 'nextProps' } },
      ],
    },
    {
      code: `
        class Foo extends React.Component<Props, State> {
          componentDidUpdate(this: Foo, props: Props) {}
          render() { return <div />; }
        }
      `,
      features: ['ts', 'no-babel'],
      errors: [
        { messageId: 'wrongName', data: { name: 'props', method: 'componentDidUpdate', expected: 'prevProps' } },
      ],
    },
  ]),
});
