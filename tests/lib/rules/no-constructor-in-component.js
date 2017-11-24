/**
 * @fileoverview Prevent using constructor in React components
 * @author Alex Husakov
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-constructor-in-component');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('no-constructor-in-component', rule, {

  valid: [{
    code: `
      class OneClass extends AnotherClass {
        constructor(props) {
          super(props);
        }
        anotherMethod() {}
      }
    `,
    parser: 'babel-eslint'
  },
  {
    code: `
      class OneComponent extends Component {
        static propTypes = {}
        state = {}
        anotherMethod() {}
      }
    `,
    parser: 'babel-eslint'
  },
  {
    code: `
      class OneComponent extends React.Component {
        static propTypes = {}
        state = {}
        anotherMethod() {}
      }
    `,
    parser: 'babel-eslint'
  },
  {
    code: `
      const Component = class OneComponent extends React.Component {
        static propTypes = {}
        state = {}
        anotherMethod() {}
      }
    `,
    parser: 'babel-eslint'
  }
  ],

  invalid: [{
    code: `
      class OneComponent extends Component {
        constructor(props) {
          super(props);
        }
        anotherMethod() {}
      }
    `,
    errors: [{
      message: 'Do not use constructor in React components'
    }],
    parser: 'babel-eslint'
  },
  {
    code: `
      class OneComponent extends React.Component {
        constructor(props) {
          super(props);
        }
        anotherMethod() {}
      }
    `,
    errors: [{
      message: 'Do not use constructor in React components'
    }],
    parser: 'babel-eslint'
  },
  {
    code: `
      const Component = class OneComponent extends Component {
        constructor(props) {
          super(props);
        }
        anotherMethod() {}
      }
    `,
    errors: [{
      message: 'Do not use constructor in React components'
    }],
    parser: 'babel-eslint'
  },
  {
    code: `
      class OneComponent extends Component {
        constructor(props) {
          super(props);
        }
        anotherMethod() {}
      }
      class TwoComponent extends Component {
        constructor(props) {
          super(props);
        }
        anotherMethod() {}
      }
    `,
    errors: [{
      message: 'Do not use constructor in React components'
    },
    {
      message: 'Do not use constructor in React components'
    }],
    parser: 'babel-eslint'
  }]
});
