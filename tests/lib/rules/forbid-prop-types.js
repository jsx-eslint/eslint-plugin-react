/**
 * @fileoverview Tests for forbid-prop-types
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/forbid-prop-types');
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

const ANY_ERROR_MESSAGE = 'Prop type `any` is forbidden';
const ARRAY_ERROR_MESSAGE = 'Prop type `array` is forbidden';
const NUMBER_ERROR_MESSAGE = 'Prop type `number` is forbidden';
const OBJECT_ERROR_MESSAGE = 'Prop type `object` is forbidden';

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('forbid-prop-types', rule, {

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
      '    s: PropTypes.string,',
      '    n: PropTypes.number,',
      '    i: PropTypes.instanceOf,',
      '    b: PropTypes.bool',
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
      '    a: PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'object']
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    o: PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array']
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    o: PropTypes.object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array']
    }]
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '  a: PropTypes.string,',
      '  b: PropTypes.string',
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
      '  elem: PropTypes.instanceOf(HTMLElement)',
      '};'
    ].join('\n')
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
    parser: 'babel-eslint'
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
      'var Hello = createReactClass({',
      '  propTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n')
  }, {
    // Proptypes declared with a spread property
    code: [
      'class Test extends React.component {',
      '  static propTypes = {',
      '    intl: React.propTypes.number,',
      '    ...propTypes',
      '  };',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    // Proptypes declared with a spread property
    code: [
      'class Test extends React.component {',
      '  static get propTypes() {',
      '    return {',
      '      intl: React.propTypes.number,',
      '      ...propTypes',
      '    };',
      '  };',
      '}'
    ].join('\n')
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{checkContextTypes: true}]
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: {',
      '    s: PropTypes.string,',
      '    n: PropTypes.number,',
      '    i: PropTypes.instanceOf,',
      '    b: PropTypes.bool',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{checkContextTypes: true}]
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: {',
      '    a: PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'object'],
      checkContextTypes: true
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: {',
      '    o: PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array'],
      checkContextTypes: true
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: {',
      '    o: PropTypes.object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array'],
      checkContextTypes: true
    }]
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.childContextTypes = {',
      '  a: PropTypes.string,',
      '  b: PropTypes.string',
      '};',
      'First.childContextTypes.justforcheck = PropTypes.string;'
    ].join('\n'),
    options: [{checkContextTypes: true}]
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.childContextTypes = {',
      '  elem: PropTypes.instanceOf(HTMLElement)',
      '};'
    ].join('\n'),
    options: [{checkContextTypes: true}]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.childContextTypes = {',
      '  "aria-controls": PropTypes.string',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{checkContextTypes: true}]
  }, {
    // Invalid code, should not be validated
    code: [
      'class Component extends React.Component {',
      '  childContextTypes: {',
      '    a: PropTypes.any,',
      '    c: PropTypes.any,',
      '    b: PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{checkContextTypes: true}]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    let { a, ...b } = obj;',
      '    let c = { ...d };',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{checkContextTypes: true}]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  childContextTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{checkContextTypes: true}]
  }, {
    // Proptypes declared with a spread property
    code: [
      'class Test extends React.component {',
      '  static childContextTypes = {',
      '    intl: React.childContextTypes.number,',
      '    ...childContextTypes',
      '  };',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{checkContextTypes: true}]
  }, {
    // Proptypes declared with a spread property
    code: [
      'class Test extends React.component {',
      '  static get childContextTypes() {',
      '    return {',
      '      intl: React.childContextTypes.number,',
      '      ...childContextTypes',
      '    };',
      '  };',
      '}'
    ].join('\n'),
    options: [{checkContextTypes: true}]
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: externalPropTypes,',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{checkChildContextTypes: true}]
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: {',
      '    s: PropTypes.string,',
      '    n: PropTypes.number,',
      '    i: PropTypes.instanceOf,',
      '    b: PropTypes.bool',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{checkChildContextTypes: true}]
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: {',
      '    a: PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'object'],
      checkChildContextTypes: true
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: {',
      '    o: PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array'],
      checkChildContextTypes: true
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: {',
      '    o: PropTypes.object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['any', 'array'],
      checkChildContextTypes: true
    }]
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.childContextTypes = {',
      '  a: PropTypes.string,',
      '  b: PropTypes.string',
      '};',
      'First.childContextTypes.justforcheck = PropTypes.string;'
    ].join('\n'),
    options: [{checkChildContextTypes: true}]
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.childContextTypes = {',
      '  elem: PropTypes.instanceOf(HTMLElement)',
      '};'
    ].join('\n'),
    options: [{checkChildContextTypes: true}]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello</div>;',
      '  }',
      '}',
      'Hello.childContextTypes = {',
      '  "aria-controls": PropTypes.string',
      '};'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{checkChildContextTypes: true}]
  }, {
    // Invalid code, should not be validated
    code: [
      'class Component extends React.Component {',
      '  childContextTypes: {',
      '    a: PropTypes.any,',
      '    c: PropTypes.any,',
      '    b: PropTypes.any',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{checkChildContextTypes: true}]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  render: function() {',
      '    let { a, ...b } = obj;',
      '    let c = { ...d };',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{checkChildContextTypes: true}]
  }, {
    code: [
      'var Hello = createReactClass({',
      '  childContextTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{checkChildContextTypes: true}]
  }, {
    // Proptypes declared with a spread property
    code: [
      'class Test extends React.component {',
      '  static childContextTypes = {',
      '    intl: React.childContextTypes.number,',
      '    ...childContextTypes',
      '  };',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{checkChildContextTypes: true}]
  }, {
    // Proptypes declared with a spread property
    code: [
      'class Test extends React.component {',
      '  static get childContextTypes() {',
      '    return {',
      '      intl: React.childContextTypes.number,',
      '      ...childContextTypes',
      '    };',
      '  };',
      '}'
    ].join('\n'),
    options: [{checkChildContextTypes: true}]
  }, {
    code: [
      'class TestComponent extends React.Component {',
      '  static defaultProps = function () {',
      '    const date = new Date();',
      '    return {',
      '      date',
      '    };',
      '  }();',
      '}'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'class HeroTeaserList extends React.Component {',
      '  render() { return null; }',
      '}',
      'HeroTeaserList.propTypes = Object.assign({',
      '  heroIndex: PropTypes.number,',
      '  preview: PropTypes.bool,',
      '}, componentApi, teaserListProps);'
    ].join('\n')
  }],

  invalid: [{
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    n: PropTypes.number',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: NUMBER_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }],
    options: [{
      forbid: ['number']
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.any.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: ARRAY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.array.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: ARRAY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: OBJECT_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.object.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: [{
      message: OBJECT_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: 2
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    s: PropTypes.shape({,',
      '      o: PropTypes.object',
      '    })',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: 1
  }, {
    code: [
      'var First = createReactClass({',
      '  propTypes: {',
      '    a: PropTypes.array',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});',
      'var Second = createReactClass({',
      '  propTypes: {',
      '    o: PropTypes.object',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    errors: 2
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = {',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '};',
      'class Second extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Second.propTypes = {',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '};'
    ].join('\n'),
    errors: 4
  }, {
    code: [
      'class First extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'First.propTypes = forbidExtraProps({',
      '    a: PropTypes.array',
      '});'
    ].join('\n'),
    errors: 1,
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'import { forbidExtraProps } from "airbnb-prop-types";',
      'export const propTypes = {dpm: PropTypes.any};',
      'export default function Component() {}',
      'Component.propTypes = propTypes;'
    ].join('\n'),
    errors: [{message: ANY_ERROR_MESSAGE}]
  }, {
    code: [
      'import { forbidExtraProps } from "airbnb-prop-types";',
      'export const propTypes = {a: PropTypes.any};',
      'export default function Component() {}',
      'Component.propTypes = forbidExtraProps(propTypes);'
    ].join('\n'),
    errors: [{message: ANY_ERROR_MESSAGE}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = {',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: 2
  }, {
    code: [
      'class Component extends React.Component {',
      '  static get propTypes() {',
      '    return {',
      '      a: PropTypes.array,',
      '      o: PropTypes.object',
      '    };',
      '  };',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    errors: 2
  }, {
    code: [
      'class Component extends React.Component {',
      '  static propTypes = forbidExtraProps({',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '  });',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: 2,
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'class Component extends React.Component {',
      '  static get propTypes() {',
      '    return forbidExtraProps({',
      '      a: PropTypes.array,',
      '      o: PropTypes.object',
      '    });',
      '  }',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    errors: 2,
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'var Hello = createReactClass({',
      '  propTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['instanceOf']
    }],
    errors: 1
  }, {
    code: [
      'var object = PropTypes.object;',
      'var Hello = createReactClass({',
      '  propTypes: {',
      '    retailer: object,',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['object']
    }],
    errors: 1
  }, {
    code: [
      'var First = createReactClass({',
      '  contextTypes: {',
      '    a: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{checkContextTypes: true}],
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class Foo extends Component {',
      '  static contextTypes = {',
      '    a: PropTypes.any',
      '  }',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{checkContextTypes: true}],
    parser: 'babel-eslint',
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class Foo extends Component {',
      '  static get contextTypes() {',
      '    return {',
      '      a: PropTypes.any',
      '    };',
      '  }',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{checkContextTypes: true}],
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 4,
      column: 7,
      type: 'Property'
    }]
  }, {
    code: [
      'class Foo extends Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Foo.contextTypes = {',
      '  a: PropTypes.any',
      '};'
    ].join('\n'),
    options: [{checkContextTypes: true}],
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 7,
      column: 3,
      type: 'Property'
    }]
  }, {
    code: [
      'function Foo(props) {',
      '  return <div />;',
      '}',
      'Foo.contextTypes = {',
      '  a: PropTypes.any',
      '};'
    ].join('\n'),
    options: [{checkContextTypes: true}],
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 5,
      column: 3,
      type: 'Property'
    }]
  }, {
    code: [
      'const Foo = (props) => {',
      '  return <div />;',
      '};',
      'Foo.contextTypes = {',
      '  a: PropTypes.any',
      '};'
    ].join('\n'),
    options: [{checkContextTypes: true}],
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 5,
      column: 3,
      type: 'Property'
    }]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static contextTypes = forbidExtraProps({',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '  });',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: 2,
    options: [{checkContextTypes: true}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'class Component extends React.Component {',
      '  static get contextTypes() {',
      '    return forbidExtraProps({',
      '      a: PropTypes.array,',
      '      o: PropTypes.object',
      '    });',
      '  }',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    errors: 2,
    options: [{checkContextTypes: true}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'class Component extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Component.contextTypes = forbidExtraProps({',
      '  a: PropTypes.array,',
      '  o: PropTypes.object',
      '});'
    ].join('\n'),
    errors: 2,
    options: [{checkContextTypes: true}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'function Component(props) {',
      '  return <div />;',
      '}',
      'Component.contextTypes = forbidExtraProps({',
      '  a: PropTypes.array,',
      '  o: PropTypes.object',
      '});'
    ].join('\n'),
    errors: 2,
    options: [{checkContextTypes: true}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'const Component = (props) => {',
      '  return <div />;',
      '};',
      'Component.contextTypes = forbidExtraProps({',
      '  a: PropTypes.array,',
      '  o: PropTypes.object',
      '});'
    ].join('\n'),
    errors: 2,
    options: [{checkContextTypes: true}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'var Hello = createReactClass({',
      '  contextTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['instanceOf'],
      checkContextTypes: true
    }],
    errors: 1
  }, {
    code: [
      'class Component extends React.Component {',
      '  static contextTypes = {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  }',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      forbid: ['instanceOf'],
      checkContextTypes: true
    }],
    errors: 1
  }, {
    code: [
      'class Component extends React.Component {',
      '  static get contextTypes() {',
      '    return {',
      '      retailer: PropTypes.instanceOf(Map).isRequired,',
      '      requestRetailer: PropTypes.func.isRequired',
      '    };',
      '  }',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{
      forbid: ['instanceOf'],
      checkContextTypes: true
    }],
    errors: 1
  }, {
    code: [
      'class Component extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Component.contextTypes = {',
      '  retailer: PropTypes.instanceOf(Map).isRequired,',
      '  requestRetailer: PropTypes.func.isRequired',
      '}'
    ].join('\n'),
    options: [{
      forbid: ['instanceOf'],
      checkContextTypes: true
    }],
    errors: 1
  }, {
    code: [
      'function Component(props) {',
      '  return <div />;',
      '}',
      'Component.contextTypes = {',
      '  retailer: PropTypes.instanceOf(Map).isRequired,',
      '  requestRetailer: PropTypes.func.isRequired',
      '}'
    ].join('\n'),
    options: [{
      forbid: ['instanceOf'],
      checkContextTypes: true
    }],
    errors: 1
  }, {
    code: [
      'const Component = (props) => {',
      '  return <div />;',
      '};',
      'Component.contextTypes = {',
      '  retailer: PropTypes.instanceOf(Map).isRequired,',
      '  requestRetailer: PropTypes.func.isRequired',
      '}'
    ].join('\n'),
    options: [{
      forbid: ['instanceOf'],
      checkContextTypes: true
    }],
    errors: 1
  }, {
    code: [
      'var First = createReactClass({',
      '  childContextTypes: {',
      '    a: PropTypes.any',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{checkChildContextTypes: true}],
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class Foo extends Component {',
      '  static childContextTypes = {',
      '    a: PropTypes.any',
      '  }',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{checkChildContextTypes: true}],
    parser: 'babel-eslint',
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 3,
      column: 5,
      type: 'Property'
    }]
  }, {
    code: [
      'class Foo extends Component {',
      '  static get childContextTypes() {',
      '    return {',
      '      a: PropTypes.any',
      '    };',
      '  }',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    options: [{checkChildContextTypes: true}],
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 4,
      column: 7,
      type: 'Property'
    }]
  }, {
    code: [
      'class Foo extends Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Foo.childContextTypes = {',
      '  a: PropTypes.any',
      '};'
    ].join('\n'),
    options: [{checkChildContextTypes: true}],
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 7,
      column: 3,
      type: 'Property'
    }]
  }, {
    code: [
      'function Foo(props) {',
      '  return <div />;',
      '}',
      'Foo.childContextTypes = {',
      '  a: PropTypes.any',
      '};'
    ].join('\n'),
    options: [{checkChildContextTypes: true}],
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 5,
      column: 3,
      type: 'Property'
    }]
  }, {
    code: [
      'const Foo = (props) => {',
      '  return <div />;',
      '};',
      'Foo.childContextTypes = {',
      '  a: PropTypes.any',
      '};'
    ].join('\n'),
    options: [{checkChildContextTypes: true}],
    errors: [{
      message: ANY_ERROR_MESSAGE,
      line: 5,
      column: 3,
      type: 'Property'
    }]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static childContextTypes = forbidExtraProps({',
      '    a: PropTypes.array,',
      '    o: PropTypes.object',
      '  });',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: 2,
    options: [{checkChildContextTypes: true}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'class Component extends React.Component {',
      '  static get childContextTypes() {',
      '    return forbidExtraProps({',
      '      a: PropTypes.array,',
      '      o: PropTypes.object',
      '    });',
      '  }',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    errors: 2,
    options: [{checkChildContextTypes: true}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'class Component extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Component.childContextTypes = forbidExtraProps({',
      '  a: PropTypes.array,',
      '  o: PropTypes.object',
      '});'
    ].join('\n'),
    errors: 2,
    options: [{checkChildContextTypes: true}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'function Component(props) {',
      '  return <div />;',
      '}',
      'Component.childContextTypes = forbidExtraProps({',
      '  a: PropTypes.array,',
      '  o: PropTypes.object',
      '});'
    ].join('\n'),
    errors: 2,
    options: [{checkChildContextTypes: true}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'const Component = (props) => {',
      '  return <div />;',
      '};',
      'Component.childContextTypes = forbidExtraProps({',
      '  a: PropTypes.array,',
      '  o: PropTypes.object',
      '});'
    ].join('\n'),
    errors: 2,
    options: [{checkChildContextTypes: true}],
    settings: {
      propWrapperFunctions: ['forbidExtraProps']
    }
  }, {
    code: [
      'var Hello = createReactClass({',
      '  childContextTypes: {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  },',
      '  render: function() {',
      '    return <div />;',
      '  }',
      '});'
    ].join('\n'),
    options: [{
      forbid: ['instanceOf'],
      checkChildContextTypes: true
    }],
    errors: 1
  }, {
    code: [
      'class Component extends React.Component {',
      '  static childContextTypes = {',
      '    retailer: PropTypes.instanceOf(Map).isRequired,',
      '    requestRetailer: PropTypes.func.isRequired',
      '  }',
      '  render() {',
      '    return <div />;',
      '  }',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      forbid: ['instanceOf'],
      checkChildContextTypes: true
    }],
    errors: 1
  }, {
    code: [
      'class Component extends React.Component {',
      '  render() {',
      '    return <div />;',
      '  }',
      '}',
      'Component.childContextTypes = {',
      '  retailer: PropTypes.instanceOf(Map).isRequired,',
      '  requestRetailer: PropTypes.func.isRequired',
      '}'
    ].join('\n'),
    options: [{
      forbid: ['instanceOf'],
      checkChildContextTypes: true
    }],
    errors: 1
  }, {
    code: [
      'function Component(props) {',
      '  return <div />;',
      '}',
      'Component.childContextTypes = {',
      '  retailer: PropTypes.instanceOf(Map).isRequired,',
      '  requestRetailer: PropTypes.func.isRequired',
      '}'
    ].join('\n'),
    options: [{
      forbid: ['instanceOf'],
      checkChildContextTypes: true
    }],
    errors: 1
  }, {
    code: [
      'const Component = (props) => {',
      '  return <div />;',
      '};',
      'Component.childContextTypes = {',
      '  retailer: PropTypes.instanceOf(Map).isRequired,',
      '  requestRetailer: PropTypes.func.isRequired',
      '}'
    ].join('\n'),
    options: [{
      forbid: ['instanceOf'],
      checkChildContextTypes: true
    }],
    errors: 1
  }]
});
