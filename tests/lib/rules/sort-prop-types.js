/**
 * @fileoverview Tests for sort-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/sort-prop-types');
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

const ERROR_MESSAGE = 'Prop types declarations should be sorted alphabetically';
const REQUIRED_ERROR_MESSAGE = 'Required prop types must be listed before all other prop types';
const CALLBACK_ERROR_MESSAGE = 'Callback prop types must be listed after all other prop types';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('sort-prop-types', rule, {

  valid: [{
    code: [
      'var First = createReactClass({',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    A: PropTypes.any,',
      '    Z: PropTypes.string,',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    A: PropTypes.any,',
      '    z: PropTypes.string,',
      '    Z: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = createReactClass({',
      '  propTypes: {',
      '    AA: PropTypes.any,',
      '    ZZ: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '  a: PropTypes.string,',
      '  z: PropTypes.string',
      '};',
      'First.propTypes.justforcheck = PropTypes.string;'
    ].join('\n')
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '  a: PropTypes.any,',
      '  A: PropTypes.any,',
      '  z: PropTypes.string,',
      '  Z: PropTypes.string',
      '};'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    b: PropTypes.any,',
      '    c: PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.propTypes = {',
      '  "aria-controls": PropTypes.string',
      '};'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }]
  }, {
    // Invalid code, should not be validated
    code: [
      'class Component extends React.Component {',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    c: PropTypes.any,',
      '    b: PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    let { a, ...b } = obj;',
      '    let c = { ...d };',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    barRequired: PropTypes.func.isRequired,',
      '    onBar: PropTypes.func,',
      '    z: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parser: 'babel-eslint'
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
      '};'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }]
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    barRequired: PropTypes.string.isRequired,',
      '    a: PropTypes.any',
      '};'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }]
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    fooRequired: MyPropType,',
      '};'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }]
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    barRequired: PropTypes.string.isRequired,',
      '    fooRequired: PropTypes.any.isRequired,',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
      '};'
    ].join('\n'),
    options: [{
      requiredFirst: true,
      callbacksLast: true
    }]
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...c.propTypes,',
      '    a: PropTypes.string',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'const propTypes = require(\'./externalPropTypes\')',
      'const TextFieldLabel = (props) => {',
      '  return <div />;',
      '};',
      'TextFieldLabel.propTypes = propTypes;'
    ].join('\n')
  }, {
    code: [
      'const First = (props) => <div />;',
      'export const propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '};',
      'First.propTypes = propTypes;'
    ].join('\n')
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          c: PropTypes.any,
          C: PropTypes.string,
          a: PropTypes.any,
          b: PropTypes.bool,
        }),
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        a: PropTypes.any,
        b: PropTypes.any,
        c: PropTypes.shape({
          c: PropTypes.any,
          ...otherPropTypes,
          a: PropTypes.any,
          b: PropTypes.bool,
        }),
      };
    `,
    options: [{
      sortShapeProp: true
    }]
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        a: PropTypes.any,
        b: PropTypes.any,
        c: PropTypes.shape(
          importedPropType,
        ),
      };
    `,
    options: [{
      sortShapeProp: true
    }]
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        a: PropTypes.any,
        z: PropTypes.any,
      };
    `,
    options: [{
      noSortAlphabetically: true
    }]
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        z: PropTypes.any,
        a: PropTypes.any,
      };
    `,
    options: [{
      noSortAlphabetically: true
    }]
  }],

  invalid: [{
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    z: PropTypes.string,',
      '    a: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }],
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    z: PropTypes.any,',
      '    Z: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }],
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    Z: PropTypes.any,',
      '    z: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    Z: PropTypes.any,',
      '    a: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      ignoreCase: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }],
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    Z: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    A: PropTypes.any,',
      '    z: PropTypes.string,',
      '    Z: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: 2,
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    A: PropTypes.any,',
      '    Z: PropTypes.string,',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    Zz: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = createReactClass({',
      '  propTypes: {',
      '    aAA: PropTypes.any,',
      '    ZZ: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: 2,
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    Zz: PropTypes.string,',
      '    a: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = createReactClass({',
      '  propTypes: {',
      '    ZZ: PropTypes.string,',
      '    aAA: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    yy: PropTypes.any,',
      '    bb: PropTypes.string',
      '};',
      'class Second extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Second.propTypes = {',
      '    aAA: PropTypes.any,',
      '    ZZ: PropTypes.string',
      '};'
    ].join('\n'),
    errors: 2,
    output: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    bb: PropTypes.string,',
      '    yy: PropTypes.any',
      '};',
      'class Second extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Second.propTypes = {',
      '    ZZ: PropTypes.string,',
      '    aAA: PropTypes.any',
      '};'
    ].join('\n')
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    z: PropTypes.any,',
      '    y: PropTypes.any,',
      '    a: PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: 2,
    output: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    y: PropTypes.any,',
      '    z: PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n')
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = forbidExtraProps({',
      '    z: PropTypes.any,',
      '    y: PropTypes.any,',
      '    a: PropTypes.any',
      '  });',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    },
    errors: 2,
    output: [
      'class Component extends React.Component {',
      '  static propTypes = forbidExtraProps({',
      '    a: PropTypes.any,',
      '    y: PropTypes.any,',
      '    z: PropTypes.any',
      '  });',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onFoo: PropTypes.func,',
      '    onBar: PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 6,
      column: 5,
      type: 'Property'
    }],
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onFoo: PropTypes.func,',
      '    onBar: PropTypes.func',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      line: 6,
      column: 5,
      type: 'Property'
    }],
    output: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n')
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onFoo: PropTypes.func,',
      '    onBar: PropTypes.func',
      '};'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 10,
      column: 5,
      type: 'Property'
    }],
    output: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
      '};'
    ].join('\n')
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = forbidExtraProps({',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onFoo: PropTypes.func,',
      '    onBar: PropTypes.func',
      '});'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    },
    errors: [{
      message: ERROR_MESSAGE,
      line: 10,
      column: 5,
      type: 'Property'
    }],
    output: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = forbidExtraProps({',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
      '});'
    ].join('\n')
  }, {
    code: [
      'const First = (props) => <div />;',
      'const propTypes = {',
      '    z: PropTypes.string,',
      '    a: PropTypes.any,',
      '};',
      'First.propTypes = forbidExtraProps(propTypes);'
    ].join('\n'),
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    },
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }],
    output: [
      'const First = (props) => <div />;',
      'const propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '};',
      'First.propTypes = forbidExtraProps(propTypes);'
    ].join('\n')
  }, {
    code: [
      'const First = (props) => <div />;',
      'const propTypes = {',
      '    z: PropTypes.string,',
      '    a: PropTypes.any,',
      '};',
      'First.propTypes = propTypes;'
    ].join('\n'),
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    },
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }],
    output: [
      'const First = (props) => <div />;',
      'const propTypes = {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '};',
      'First.propTypes = propTypes;'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func,',
      '    z: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      callbacksLast: true
    }],
    errors: [{
      message: CALLBACK_ERROR_MESSAGE,
      line: 5,
      column: 5,
      type: 'Property'
    }],
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string,',
      '    onBar: PropTypes.func,',
      '    onFoo: PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    fooRequired: PropTypes.string.isRequired,',
      '    barRequired: PropTypes.string.isRequired,',
      '    a: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }],
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    barRequired: PropTypes.string.isRequired,',
      '    fooRequired: PropTypes.string.isRequired,',
      '    a: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    barRequired: PropTypes.string.isRequired,',
      '    onFoo: PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      requiredFirst: true
    }],
    errors: [{
      message: REQUIRED_ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }],
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    barRequired: PropTypes.string.isRequired,',
      '    a: PropTypes.any,',
      '    onFoo: PropTypes.func',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...a.propTypes,',
      '    d: PropTypes.string,',
      '    c: PropTypes.string',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      line: 6,
      column: 5,
      type: 'Property'
    }],
    output: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...a.propTypes,',
      '    c: PropTypes.string,',
      '    d: PropTypes.string',
      '  }',
      '}'
    ].join('\n')
  }, {
    code: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...a.propTypes,',
      '    f: PropTypes.string,',
      '    d: PropTypes.string,',
      '    ...e.propTypes,',
      '    c: PropTypes.string',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      line: 6,
      column: 5,
      type: 'Property'
    }],
    output: [
      'export default class ClassWithSpreadInPropTypes extends BaseClass {',
      '  static propTypes = {',
      '    b: PropTypes.string,',
      '    ...a.propTypes,',
      '    d: PropTypes.string,',
      '    f: PropTypes.string,',
      '    ...e.propTypes,',
      '    c: PropTypes.string',
      '  }',
      '}'
    ].join('\n')
  }, {
    code: [
      'const propTypes = {',
      '  b: PropTypes.string,',
      '  a: PropTypes.string,',
      '};',
      'const TextFieldLabel = (props) => {',
      '  return <div />;',
      '};',
      'TextFieldLabel.propTypes = propTypes;'
    ].join('\n'),
    errors: [{
      message: ERROR_MESSAGE,
      line: 3,
      column: 3,
      type: 'Property'
    }],
    output: [
      'const propTypes = {',
      '  a: PropTypes.string,',
      '  b: PropTypes.string,',
      '};',
      'const TextFieldLabel = (props) => {',
      '  return <div />;',
      '};',
      'TextFieldLabel.propTypes = propTypes;'
    ].join('\n')
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          c: PropTypes.any,
          a: PropTypes.any,
          b: PropTypes.bool,
        }),
      };
    `,
    options: [{
      sortShapeProp: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 12,
      column: 11,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE,
      line: 13,
      column: 11,
      type: 'Property'
    }],
    output: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          a: PropTypes.any,
          b: PropTypes.bool,
          c: PropTypes.any,
        }),
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        z: PropTypes.shape(),
        y: PropTypes.any,
      };
    `,
    options: [{
      sortShapeProp: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 10,
      column: 9,
      type: 'Property'
    }],
    output: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape(),
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        z: PropTypes.shape(someType),
        y: PropTypes.any,
      };
    `,
    options: [{
      sortShapeProp: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 10,
      column: 9,
      type: 'Property'
    }],
    output: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape(someType),
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        z: PropTypes.any,
        y: PropTypes.any,
        a: PropTypes.shape({
          c: PropTypes.any,
          C: PropTypes.string,
          a: PropTypes.any,
          b: PropTypes.bool,
        }),
      };
    `,
    options: [{
      sortShapeProp: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 9,
      column: 9,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE,
      line: 10,
      column: 9,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE,
      line: 12,
      column: 11,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE,
      line: 13,
      column: 11,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE,
      line: 14,
      column: 11,
      type: 'Property'
    }],
    output: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        a: PropTypes.shape({
          C: PropTypes.string,
          a: PropTypes.any,
          b: PropTypes.bool,
          c: PropTypes.any,
        }),
        y: PropTypes.any,
        z: PropTypes.any,
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          c: PropTypes.any,
          C: PropTypes.string,
          a: PropTypes.any,
          b: PropTypes.bool,
        }),
      };
    `,
    options: [{
      sortShapeProp: true,
      ignoreCase: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 13,
      column: 11,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE,
      line: 14,
      column: 11,
      type: 'Property'
    }],
    output: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          a: PropTypes.any,
          b: PropTypes.bool,
          c: PropTypes.any,
          C: PropTypes.string,
        }),
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          a: PropTypes.string,
          c: PropTypes.number.isRequired,
          b: PropTypes.any,
          d: PropTypes.bool,
        }),
      };
    `,
    options: [{
      sortShapeProp: true,
      requiredFirst: true
    }],
    errors: [{
      message: REQUIRED_ERROR_MESSAGE,
      line: 12,
      column: 11,
      type: 'Property'
    }],
    output: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          c: PropTypes.number.isRequired,
          a: PropTypes.string,
          b: PropTypes.any,
          d: PropTypes.bool,
        }),
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          a: PropTypes.string,
          c: PropTypes.number.isRequired,
          b: PropTypes.any,
          onFoo: PropTypes.func,
          d: PropTypes.bool,
        }),
      };
    `,
    options: [{
      sortShapeProp: true,
      callbacksLast: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 13,
      column: 11,
      type: 'Property'
    }, {
      message: CALLBACK_ERROR_MESSAGE,
      line: 14,
      column: 11,
      type: 'Property'
    }],
    output: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          a: PropTypes.string,
          b: PropTypes.any,
          c: PropTypes.number.isRequired,
          d: PropTypes.bool,
          onFoo: PropTypes.func,
        }),
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          a: PropTypes.string,
          c: PropTypes.number.isRequired,
          b: PropTypes.any,
          ...otherPropTypes,
          f: PropTypes.bool,
          d: PropTypes.string,
        }),
      };
    `,
    options: [{
      sortShapeProp: true
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 13,
      column: 11,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE,
      line: 16,
      column: 11,
      type: 'Property'
    }],
    output: `
      class Component extends React.Component {
        render() {
          return <div />;
        }
      }
      Component.propTypes = {
        x: PropTypes.any,
        y: PropTypes.any,
        z: PropTypes.shape({
          a: PropTypes.string,
          b: PropTypes.any,
          c: PropTypes.number.isRequired,
          ...otherPropTypes,
          d: PropTypes.string,
          f: PropTypes.bool,
        }),
      };
    `
  }, {
    code: `
      class Component extends React.Component {
        static propTypes = {
          z: PropTypes.any,
          y: PropTypes.any,
          a: PropTypes.shape({
            c: PropTypes.any,
            a: PropTypes.any,
            b: PropTypes.bool,
          }),
        };
        render() {
          return <div />;
        }
      }
    `,
    options: [{
      sortShapeProp: true
    }],
    parser: 'babel-eslint',
    errors: [{
      message: ERROR_MESSAGE,
      line: 5,
      column: 11,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE,
      line: 6,
      column: 11,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE,
      line: 8,
      column: 13,
      type: 'Property'
    }, {
      message: ERROR_MESSAGE,
      line: 9,
      column: 13,
      type: 'Property'
    }],
    output: `
      class Component extends React.Component {
        static propTypes = {
          a: PropTypes.shape({
            a: PropTypes.any,
            b: PropTypes.bool,
            c: PropTypes.any,
          }),
          y: PropTypes.any,
          z: PropTypes.any,
        };
        render() {
          return <div />;
        }
      }
    `
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    z: PropTypes.string,',
      '    a: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      noSortAlphabetically: false
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }],
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    z: PropTypes.string',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    \'data-letter\': PropTypes.string,',
      '    a: PropTypes.any,',
      '    e: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      noSortAlphabetically: false
    }],
    errors: [{
      message: ERROR_MESSAGE,
      line: 4,
      column: 5,
      type: 'Property'
    }],
    output: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any,',
      '    \'data-letter\': PropTypes.string,',
      '    e: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }]
});
