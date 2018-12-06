/**
 * @fileoverview Tests for forbid-foreign-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/forbid-foreign-prop-types');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ERROR_MESSAGE = 'Using propTypes from another component is not safe because they may be removed in production builds';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('forbid-foreign-prop-types', rule, {

  valid: [{
    code: 'import { propTypes } from "SomeComponent";'
  }, {
    code: 'import { propTypes as someComponentPropTypes } from "SomeComponent";'
  }, {
    code: 'const foo = propTypes'
  }, {
    code: 'foo(propTypes)'
  }, {
    code: 'foo + propTypes'
  }, {
    code: 'const foo = [propTypes]'
  }, {
    code: 'const foo = { propTypes }'
  }, {
    code: 'Foo.propTypes = propTypes'
  }, {
    code: 'Foo["propTypes"] = propTypes'
  }, {
    code: 'const propTypes = "bar"; Foo[propTypes];'
  },
  {
    code: `
      const Message = (props) => (<div>{props.message}</div>);
      Message.propTypes = {
        message: PropTypes.string
      };
      const Hello = (props) => (<Message>Hello {props.name}</Message>);
      Hello.propTypes = {
        name: Message.propTypes.message
      };
    `,
    options: [{
      allowInPropTypes: true
    }]
  },
  {
    code: `
      class MyComponent extends React.Component {
        static propTypes = {
          baz: Qux.propTypes.baz
        };
      }
    `,
    parser: 'babel-eslint',
    options: [{
      allowInPropTypes: true
    }]
  }],

  invalid: [{
    code: `
      var Foo = createReactClass({
        propTypes: Bar.propTypes,
        render: function() {
          return <Foo className="bar" />;
        }
      });
    `,
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Identifier'
    }]
  },
  {
    code: `
      var Foo = createReactClass({
        propTypes: Bar["propTypes"],
        render: function() {
          return <Foo className="bar" />;
        }
      });
    `,
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Literal'
    }]
  },
  {
    code: `
      var { propTypes } = SomeComponent
      var Foo = createReactClass({
        propTypes,
        render: function() {
          return <Foo className="bar" />;
        }
      });
    `,
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Property'
    }]
  },
  {
    code: `
      var { propTypes: things, ...foo } = SomeComponent
      var Foo = createReactClass({
        propTypes,
        render: function() {
          return <Foo className="bar" />;
        }
      });
    `,
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Property'
    }]
  },
  {
    code: `
      class MyComponent extends React.Component {
        static fooBar = {
          baz: Qux.propTypes.baz
        };
      }
    `,
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Identifier'
    }]
  },
  {
    code: `
      var { propTypes: typesOfProps } = SomeComponent
      var Foo = createReactClass({
        propTypes: typesOfProps,
        render: function() {
          return <Foo className="bar" />;
        }
      });
    `,
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Property'
    }]
  },
  {
    code: `
      const Message = (props) => (<div>{props.message}</div>);
      Message.propTypes = {
        message: PropTypes.string
      };
      const Hello = (props) => (<Message>Hello {props.name}</Message>);
      Hello.propTypes = {
        name: Message.propTypes.message
      };
    `,
    options: [{
      allowInPropTypes: false
    }],
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Identifier'
    }]
  },
  {
    code: `
      class MyComponent extends React.Component {
        static propTypes = {
          baz: Qux.propTypes.baz
        };
      }
    `,
    parser: 'babel-eslint',
    options: [{
      allowInPropTypes: false
    }],
    errors: [{
      message: ERROR_MESSAGE,
      type: 'Identifier'
    }]
  }]
});
