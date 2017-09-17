/**
 * @fileoverview Tests for no-typos
 */
'use strict';

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-typos');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ERROR_MESSAGE = 'Typo in static class property declaration';
const ERROR_MESSAGE_LIFECYCLE_METHOD = 'Typo in component lifecycle method declaration';

const ruleTester = new RuleTester();
ruleTester.run('no-typos', rule, {
  valid: [{
    code: [
      'class First {',
      '  static PropTypes = {key: "myValue"};',
      '  static ContextTypes = {key: "myValue"};',
      '  static ChildContextTypes = {key: "myValue"};',
      '  static DefaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class First {}',
      'First.PropTypes = {key: "myValue"};',
      'First.ContextTypes = {key: "myValue"};',
      'First.ChildContextTypes = {key: "myValue"};',
      'First.DefaultProps = {key: "myValue"};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {',
      '  static propTypes = {key: "myValue"};',
      '  static contextTypes = {key: "myValue"};',
      '  static childContextTypes = {key: "myValue"};',
      '  static defaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {}',
      'First.propTypes = {key: "myValue"};',
      'First.contextTypes = {key: "myValue"};',
      'First.childContextTypes = {key: "myValue"};',
      'First.defaultProps = {key: "myValue"};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  propTypes = {key: "myValue"};',
      '  contextTypes = {key: "myValue"};',
      '  childContextTypes = {key: "myValue"};',
      '  defaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  PropTypes = {key: "myValue"};',
      '  ContextTypes = {key: "myValue"};',
      '  ChildContextTypes = {key: "myValue"};',
      '  DefaultProps = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  proptypes = {key: "myValue"};',
      '  contexttypes = {key: "myValue"};',
      '  childcontextypes = {key: "myValue"};',
      '  defaultprops = {key: "myValue"};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  static PropTypes() {};',
      '  static ContextTypes() {};',
      '  static ChildContextTypes() {};',
      '  static DefaultProps() {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  static proptypes() {};',
      '  static contexttypes() {};',
      '  static childcontexttypes() {};',
      '  static defaultprops() {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {}',
      'MyClass.prototype.PropTypes = function() {};',
      'MyClass.prototype.ContextTypes = function() {};',
      'MyClass.prototype.ChildContextTypes = function() {};',
      'MyClass.prototype.DefaultProps = function() {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {}',
      'MyClass.PropTypes = function() {};',
      'MyClass.ContextTypes = function() {};',
      'MyClass.ChildContextTypes = function() {};',
      'MyClass.DefaultProps = function() {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'function MyRandomFunction() {}',
      'MyRandomFunction.PropTypes = {};',
      'MyRandomFunction.ContextTypes = {};',
      'MyRandomFunction.ChildContextTypes = {};',
      'MyRandomFunction.DefaultProps = {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class First extends React.Component {}',
      'First["prop" + "Types"] = {};',
      'First["context" + "Types"] = {};',
      'First["childContext" + "Types"] = {};',
      'First["default" + "Props"] = {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [ // This case is currently not supported
      'class First extends React.Component {}',
      'First["PROP" + "TYPES"] = {};',
      'First["CONTEXT" + "TYPES"] = {};',
      'First["CHILDCONTEXT" + "TYPES"] = {};',
      'First["DEFAULT" + "PROPS"] = {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [ // This case is currently not supported
      'const propTypes = "PROPTYPES"',
      'const contextTypes = "CONTEXTTYPES"',
      'const childContextTypes = "CHILDCONTEXTTYPES"',
      'const defautProps = "DEFAULTPROPS"',
      '',
      'class First extends React.Component {}',
      'First[propTypes] = {};',
      'First[contextTypes] = {};',
      'First[childContextTypes] = {};',
      'First[defautProps] = {};'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentWillMount() { }',
      '  componentDidMount() { }',
      '  componentWillReceiveProps() { }',
      '  shouldComponentUpdate() { }',
      '  componentWillUpdate() { }',
      '  componentDidUpdate() { }',
      '  componentWillUnmount() { }',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  componentWillMount() { }',
      '  componentDidMount() { }',
      '  componentWillReceiveProps() { }',
      '  shouldComponentUpdate() { }',
      '  componentWillUpdate() { }',
      '  componentDidUpdate() { }',
      '  componentWillUnmount() { }',
      '  render() { }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  componentwillmount() { }',
      '  componentdidmount() { }',
      '  componentwillreceiveprops() { }',
      '  shouldcomponentupdate() { }',
      '  componentwillupdate() { }',
      '  componentdidupdate() { }',
      '  componentwillUnmount() { }',
      '  render() { }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    code: [
      'class MyClass {',
      '  Componentwillmount() { }',
      '  Componentdidmount() { }',
      '  Componentwillreceiveprops() { }',
      '  Shouldcomponentupdate() { }',
      '  Componentwillupdate() { }',
      '  Componentdidupdate() { }',
      '  ComponentwillUnmount() { }',
      '  Render() { }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions
  }, {
    // https://github.com/yannickcr/eslint-plugin-react/issues/1353
    code: `
      function test(b) {
        return a.bind(b);
      }
      function a() {}
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `class Component extends React.Component {};
     Component.propTypes = {
       a: PropTypes.number.isRequired
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `class Component extends React.Component {};
     Component.propTypes = {
       e: PropTypes.shape({
         ea: PropTypes.string,
       })
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `class Component extends React.Component {};
     Component.propTypes = {
       a: PropTypes.string,
       b: PropTypes.string.isRequired,
       c: PropTypes.shape({
         d: PropTypes.string,
         e: PropTypes.number.isRequired,
       }).isRequired
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `class Component extends React.Component {};
    Component.propTypes = {
       a: PropTypes.oneOfType([
         PropTypes.string,
         PropTypes.number
       ])
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `class Component extends React.Component {};
    Component.propTypes = {
       a: PropTypes.oneOf([
         'hello',
         'hi'
       ])
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `class Component extends React.Component {};
     Component.childContextTypes = {
       a: PropTypes.string,
       b: PropTypes.string.isRequired,
       c: PropTypes.shape({
         d: PropTypes.string,
         e: PropTypes.number.isRequired,
       }).isRequired
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `class Component extends React.Component {};
     Component.contextTypes = {
       a: PropTypes.string,
       b: PropTypes.string.isRequired,
       c: PropTypes.shape({
         d: PropTypes.string,
         e: PropTypes.number.isRequired,
       }).isRequired
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions
  }, {
    code: `
      const fn = (err, res) => {
        const { body: data = {} } = { ...res };
        data.time = data.time || {};
      };
    `,
    parser: 'babel-eslint'
  }],

  invalid: [{
    code: [
      'class Component extends React.Component {',
      '  static PropTypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.PropTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.PropTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static proptypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.proptypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.proptypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static ContextTypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.ContextTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.ContextTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static contexttypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.contexttypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.contexttypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static ChildContextTypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.ChildContextTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.ChildContextTypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static childcontexttypes = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.childcontexttypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.childcontexttypes = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static DefaultProps = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.DefaultProps = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.DefaultProps = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {',
      '  static defaultprops = {};',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Component extends React.Component {}',
      'Component.defaultprops = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'function MyComponent() { return (<div>{this.props.myProp}</div>) }',
      'MyComponent.defaultprops = {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'Component.defaultprops = {}',
      'class Component extends React.Component {}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: `
      /** @extends React.Component */
      class MyComponent extends BaseComponent {}
      MyComponent.PROPTYPES = {}
    `,
    parserOptions: parserOptions,
    errors: [{message: ERROR_MESSAGE}]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  ComponentWillMount() { }',
      '  ComponentDidMount() { }',
      '  ComponentWillReceiveProps() { }',
      '  ShouldComponentUpdate() { }',
      '  ComponentWillUpdate() { }',
      '  ComponentDidUpdate() { }',
      '  ComponentWillUnmount() { }',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  Componentwillmount() { }',
      '  Componentdidmount() { }',
      '  Componentwillreceiveprops() { }',
      '  Shouldcomponentupdate() { }',
      '  Componentwillupdate() { }',
      '  Componentdidupdate() { }',
      '  Componentwillunmount() { }',
      '  Render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  componentwillmount() { }',
      '  componentdidmount() { }',
      '  componentwillreceiveprops() { }',
      '  shouldcomponentupdate() { }',
      '  componentwillupdate() { }',
      '  componentdidupdate() { }',
      '  componentwillunmount() { }',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\n'),
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }, {
      message: ERROR_MESSAGE_LIFECYCLE_METHOD,
      type: 'MethodDefinition'
    }]
  }, {
    code: `class Component extends React.Component {};
     Component.propTypes = {
        a: PropTypes.Number.isRequired
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: Number'
    }]
  }, {
    code: `class Component extends React.Component {};
     Component.propTypes = {
        a: PropTypes.number.isrequired
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in prop type chain qualifier: isrequired'
    }]
  }, {
    code: `class Component extends React.Component {};
     Component.propTypes = {
        a: PropTypes.Number
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: Number'
    }]
  }, {
    code: `class Component extends React.Component {};
    Component.propTypes = {
       a: PropTypes.shape({
         b: PropTypes.String,
         c: PropTypes.number.isRequired,
       })
    }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: String'
    }]
  }, {
    code: `class Component extends React.Component {};
    Component.propTypes = {
       a: PropTypes.oneOfType([
         PropTypes.bools,
         PropTypes.number,
       ])
     }
   `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }]
  }, {
    code: `class Component extends React.Component {};
      Component.propTypes = {
        a: PropTypes.bools,
        b: PropTypes.Array,
        c: PropTypes.function,
        d: PropTypes.objectof,
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
    code: `class Component extends React.Component {};
      Component.childContextTypes = {
        a: PropTypes.bools,
        b: PropTypes.Array,
        c: PropTypes.function,
        d: PropTypes.objectof,
      }
    `,
    parser: 'babel-eslint',
    parserOptions: parserOptions,
    errors: [{
      message: 'Typo in declared prop type: bools'
    }, {
      message: 'Typo in declared prop type: Array'
    }, {
      message: 'Typo in declared prop type: function'
    }, {
      message: 'Typo in declared prop type: objectof'
    }]
  }, {
  // PropTypes declared on a component that is detected through JSDoc comments and is
  // declared AFTER the PropTypes only works when ESLint version is >= 4.7.0
    code: `
      MyComponent.PROPTYPES = {}
      /** @extends React.Component */
      class MyComponent extends BaseComponent {}
    `,
    parserOptions: parserOptions,
    errors: [{
      message: ERROR_MESSAGE
    }]
  }]
});
