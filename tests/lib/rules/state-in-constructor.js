/**
 * @fileoverview Enforce the state initialization style to be either in a constructor or with a class property
 * @author Kanitkorn Sujautra
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester;
const rule = require('../../../lib/rules/state-in-constructor');

const parsers = require('../../helpers/parsers');

const ruleTesterConfig = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester(ruleTesterConfig);
ruleTester.run('state-in-constructor', rule, {
  valid: parsers.all([
    {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>Foo</div>
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          render() {
            return <div>Foo</div>
          }
        }
      `,
      options: ['never'],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      options: ['always'],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.baz = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.baz = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      options: ['never'],
    },
    {
      code: `
        class Foo extends React.Component {
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
    },
    {
      code: `
        class Foo extends React.Component {
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      options: ['never'],
    },
    {
      code: `
        const Foo = () => <div>Foo</div>
      `,
    },
    {
      code: `
        const Foo = () => <div>Foo</div>
      `,
      options: ['never'],
    },
    {
      code: `
        function Foo () {
          return <div>Foo</div>
        }
      `,
    },
    {
      code: `
        function Foo () {
          return <div>Foo</div>
        }
      `,
      options: ['never'],
    },
    {
      code: `
        class Foo extends React.Component {
          state = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      options: ['never'],
    },
    {
      code: `
        class Foo extends React.Component {
          state = { bar: 0 }
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      options: ['never'],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.baz = { bar: 0 }
          }
          state = { baz: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      options: ['never'],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            if (foobar) {
              this.state = { bar: 0 }
            }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            foobar = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `,
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            foobar = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      options: ['never'],
    },
  ]),

  invalid: parsers.all([
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      options: ['never'],
      errors: [{ messageId: 'stateInitClassProp' }],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      options: ['never'],
      errors: [{ messageId: 'stateInitClassProp' }],
    },
    {
      code: `
        class Foo extends React.Component {
          state = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'stateInitConstructor' }],
    },
    {
      code: `
        class Foo extends React.Component {
          state = { bar: 0 }
          baz = { bar: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'stateInitConstructor' }],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.baz = { bar: 0 }
          }
          state = { baz: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'stateInitConstructor' }],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          state = { baz: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      errors: [{ messageId: 'stateInitConstructor' }],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            this.state = { bar: 0 }
          }
          state = { baz: 0 }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      options: ['never'],
      errors: [{ messageId: 'stateInitClassProp' }],
    },
    {
      code: `
        class Foo extends React.Component {
          constructor(props) {
            super(props)
            if (foobar) {
              this.state = { bar: 0 }
            }
          }
          render() {
            return <div>Foo</div>
          }
        }
      `,
      features: ['class fields'],
      options: ['never'],
      errors: [{ messageId: 'stateInitClassProp' }],
    },
  ]),
});
