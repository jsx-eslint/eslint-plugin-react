/**
 * @fileoverview Enforce the state initialization style to be either in a constructor or with a class property
 * @author Kanitkorn Sujautra
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/state-in-constructor');
const RuleTester = require('eslint').RuleTester;

const ruleTesterConfig = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester(ruleTesterConfig);
ruleTester.run('state-in-constructor', rule, {
  valid: [{
    code: `
      class Foo extends React.Component {
        render() {
          return <div>Foo</div>
        }
      }
    `
  }, {
    code: `
      class Foo extends React.Component {
        render() {
          return <div>Foo</div>
        }
      }
    `,
    options: ['never']
  }, {
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
    `
  }, {
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
    options: ['always']
  }, {
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
    `
  }, {
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
    `
  }, {
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
    options: ['never']
  }, {
    code: `
      class Foo extends React.Component {
        baz = { bar: 0 }
        render() {
          return <div>Foo</div>
        }
      }
    `
  }, {
    code: `
      class Foo extends React.Component {
        baz = { bar: 0 }
        render() {
          return <div>Foo</div>
        }
      }
    `,
    options: ['never']
  }, {
    code: `
      const Foo = () => <div>Foo</div>
    `
  }, {
    code: `
      const Foo = () => <div>Foo</div>
    `,
    options: ['never']
  }, {
    code: `
      function Foo () {
        return <div>Foo</div>
      }
    `
  }, {
    code: `
      function Foo () {
        return <div>Foo</div>
      }
    `,
    options: ['never']
  }, {
    code: `
      class Foo extends React.Component {
        state = { bar: 0 }
        render() {
          return <div>Foo</div>
        }
      }
    `,
    options: ['never']
  }, {
    code: `
      class Foo extends React.Component {
        state = { bar: 0 }
        baz = { bar: 0 }
        render() {
          return <div>Foo</div>
        }
      }
    `,
    options: ['never']
  }, {
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
    options: ['never']
  }, {
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
    `
  }, {
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
    `
  }, {
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
    options: ['never']
  }],

  invalid: [{
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
    errors: [{
      message: 'State initialization should be in a class property'
    }]
  }, {
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
    options: ['never'],
    errors: [{
      message: 'State initialization should be in a class property'
    }]
  }, {
    code: `
      class Foo extends React.Component {
        state = { bar: 0 }
        render() {
          return <div>Foo</div>
        }
      }
    `,
    errors: [{
      message: 'State initialization should be in a constructor'
    }]
  }, {
    code: `
      class Foo extends React.Component {
        state = { bar: 0 }
        baz = { bar: 0 }
        render() {
          return <div>Foo</div>
        }
      }
    `,
    errors: [{
      message: 'State initialization should be in a constructor'
    }]
  }, {
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
    errors: [{
      message: 'State initialization should be in a constructor'
    }]
  }, {
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
    errors: [{
      message: 'State initialization should be in a constructor'
    }]
  }, {
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
    options: ['never'],
    errors: [{
      message: 'State initialization should be in a class property'
    }]
  }, {
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
    options: ['never'],
    errors: [{
      message: 'State initialization should be in a class property'
    }]
  }]
});
