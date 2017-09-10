/**
 * @fileoverview Enforces consistent naming for boolean props
 * @author Ev Haus
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/boolean-prop-naming');
const RuleTester = require('eslint').RuleTester;

require('babel-eslint');

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('boolean-prop-naming', rule, {

  valid: [{
    code: `
      var Hello = createReactClass({
        propTypes: {isSomething: PropTypes.bool, hasValue: PropTypes.bool},
        render: function() { return <div />; }
      });
    `
  }, {
    code: `
      var Hello = createReactClass({
        propTypes: {isSomething: PropTypes.bool},
        render: function() { return <div />; }
      });
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        propTypes: {isSomething: React.PropTypes.bool},
        render: function() { return <div />; }
      });
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    code: `
      var Hello = React.createClass({
        propTypes: {isSomething: PropTypes.bool},
        render: function() { return <div />; }
      });
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    settings: {
      react: {
        createClass: 'createClass'
      }
    }
  }, {
    code: `
      var Hello = React.createClass({
        propTypes: {something: PropTypes.any},
        render: function() { return <div />; }
      });
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    settings: {
      react: {
        createClass: 'createClass'
      }
    }
  }, {
    code: `
      class Hello extends React.Component {
        render () { return <div />; }
      }
      Hello.propTypes = {isSomething: PropTypes.bool}
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        render () { return <div />; }
      }
      Hello.propTypes = wrap({ a: PropTypes.bool })
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        render () { return <div />; }
      }
      Hello.propTypes = {something: PropTypes.any}
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    code: `
      class Hello extends Component {
        render () { return <div />; }
      }
      Hello.propTypes = {isSomething: PropTypes.bool}
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        static propTypes = {isSomething: PropTypes.bool};
        render () { return <div />; }
      }
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      class Hello extends React.Component {
        static propTypes = {isSomething: React.PropTypes.bool};
        render () { return <div />; }
      }
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      class Hello extends React.Component {
        static propTypes = {something: PropTypes.any};
        render () { return <div />; }
      }
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      class Hello extends React.Component {
        props: {isSomething: boolean};
        render () { return <div />; }
      }
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      class Hello extends React.Component {
        props: {something: any};
        render () { return <div />; }
      }
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      var Hello = ({isSomething}) => { return <div /> }
      Hello.propTypes = {isSomething: PropTypes.bool};
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      type Props = {
        isSomething: boolean;
      };
      function Hello(props: Props): React.Element { return <div /> }
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      class Hello extends React.Component {
        static propTypes = {
          isSomething: PropTypes.mutuallyExclusiveTrueProps,
          something: PropTypes.bool
        };
        render () { return <div />; }
      }
    `,
    options: [{
      propTypeNames: ['mutuallyExclusiveTrueProps'],
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      class Hello extends React.Component {
        static propTypes = {
          isSomething: mutuallyExclusiveTrueProps,
          isSomethingElse: bool
        };
        render () { return <div />; }
      }
    `,
    options: [{
      propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      var x = {a: 1}
      var y = {...x}
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }, {
    code: `
      class Hello extends PureComponent {
        props: PropsType;
        render () { return <div /> }
      }
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: `
      var Hello = createReactClass({
        propTypes: {something: PropTypes.bool},
        render: function() { return <div />; }
      });
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      var Hello = createReactClass({
        propTypes: {something: React.PropTypes.bool},
        render: function() { return <div />; }
      });
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      var Hello = React.createClass({
        propTypes: {something: PropTypes.bool},
        render: function() { return <div />; }
      });
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    settings: {
      react: {
        createClass: 'createClass'
      }
    },
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        render () { return <div />; }
      }
      Hello.propTypes = {something: PropTypes.bool}
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      class Hello extends Component {
        render () { return <div />; }
      }
      Hello.propTypes = {something: PropTypes.bool}
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        static propTypes = {something: PropTypes.bool};
        render () { return <div />; }
      }
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        props: {something: boolean};
        render () { return <div />; }
      }
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      var Hello = ({something}) => { return <div /> }
      Hello.propTypes = {something: PropTypes.bool};
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      type Props = {
        something: boolean;
      };
      function Hello(props: Props): React.Element { return <div /> }
    `,
    options: [{
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        static propTypes = {something: PropTypes.mutuallyExclusiveTrueProps};
        render () { return <div />; }
      }
    `,
    options: [{
      propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        static propTypes = {
          something: PropTypes.mutuallyExclusiveTrueProps,
          somethingElse: PropTypes.bool
        };
        render () { return <div />; }
      }
    `,
    options: [{
      propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }, {
      message: 'Prop name (somethingElse) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }, {
    code: `
      class Hello extends React.Component {
        static propTypes = {
          something: mutuallyExclusiveTrueProps,
          somethingElse: bool
        };
        render () { return <div />; }
      }
    `,
    options: [{
      propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
      rule: '^is[A-Z]([A-Za-z0-9]?)+'
    }],
    parser: 'babel-eslint',
    errors: [{
      message: 'Prop name (something) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }, {
      message: 'Prop name (somethingElse) doesn\'t match rule (^is[A-Z]([A-Za-z0-9]?)+)'
    }]
  }]
});
