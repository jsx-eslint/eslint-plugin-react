/**
 * @fileoverview Tests for no-unused-state
 */

'use strict';

const rule = require('../../../lib/rules/no-unused-state');
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true,
    experimentalObjectRestSpread: true
  }
};

const eslintTester = new RuleTester({parserOptions});

function getErrorMessages(unusedFields) {
  return unusedFields.map(function(field) {
    return {
      message: `Unused state field: '${field}'`
    };
  });
}

eslintTester.run('no-unused-state', rule, {
  valid: [
    `function StatelessFnUnaffectedTest(props) {
       return <SomeComponent foo={props.foo} />;
    };`,
    `var NoStateTest = createReactClass({
      render: function() {
        return <SomeComponent />;
      }
    });`,
    `var NoStateMethodTest = createReactClass({
      render() {
        return <SomeComponent />;
      }
    });`,
    `var GetInitialStateTest = createReactClass({
      getInitialState: function() {
        return { foo: 0 };
      },
      render: function() {
        return <SomeComponent foo={this.state.foo} />;
      }
    });`,
    `var GetInitialStateMethodTest = createReactClass({
      getInitialState() {
        return { foo: 0 };
      },
      render() {
        return <SomeComponent foo={this.state.foo} />;
      }
    });`,
    `var SetStateTest = createReactClass({
      onFooChange(newFoo) {
        this.setState({ foo: newFoo });
      },
      render() {
        return <SomeComponent foo={this.state.foo} />;
      }
    });`,
    `var MultipleSetState = createReactClass({
      getInitialState() {
        return { foo: 0 };
      },
      update() {
        this.setState({foo: 1});
      },
      render() {
        return <SomeComponent onClick={this.update} foo={this.state.foo} />;
      }
    });`,
    `class NoStateTest extends React.Component {
      render() {
        return <SomeComponent />;
      }
    }`,
    `class CtorStateTest extends React.Component {
      constructor() {
        this.state = { foo: 0 };
      }
      render() {
        return <SomeComponent foo={this.state.foo} />;
      }
    }`,
    `class SetStateTest extends React.Component {
        onFooChange(newFoo) {
          this.setState({ foo: newFoo });
        }
        render() {
          return <SomeComponent foo={this.state.foo} />;
        }
      }`,
    {
      code: `class ClassPropertyStateTest extends React.Component {
          state = { foo: 0 };
          render() {
            return <SomeComponent foo={this.state.foo} />;
          }
        }`,
      parser: 'babel-eslint'
    },
    `class VariableDeclarationTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const foo = this.state.foo;
          return <SomeComponent foo={foo} />;
        }
      }`,
    `class DestructuringTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const {foo: myFoo} = this.state;
          return <SomeComponent foo={myFoo} />;
        }
      }`,
    `class ShorthandDestructuringTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const {foo} = this.state;
          return <SomeComponent foo={foo} />;
        }
      }`,
    `class AliasDeclarationTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const state = this.state;
          return <SomeComponent foo={state.foo} />;
        }
      }`,
    `class AliasAssignmentTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          let state;
          state = this.state;
          return <SomeComponent foo={state.foo} />;
        }
      }`,
    `class DestructuringAliasTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const {state: myState} = this;
          return <SomeComponent foo={myState.foo} />;
        }
      }`,
    `class ShorthandDestructuringAliasTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const {state} = this;
          return <SomeComponent foo={state.foo} />;
        }
      }`,
    `class RestPropertyTest extends React.Component {
        constructor() {
          this.state = {
            foo: 0,
            bar: 1,
          };
        }
        render() {
          const {foo, ...others} = this.state;
          return <SomeComponent foo={foo} bar={others.bar} />;
        }
      }`,
    {
      code: `class DeepDestructuringTest extends React.Component {
        state = { foo: 0, bar: 0 };
        render() {
          const {state: {foo, ...others}} = this;
          return <SomeComponent foo={foo} bar={others.bar} />;
        }
      }`,
      parser: 'babel-eslint'
    },
    // A cleverer analysis might recognize that the following should be errors,
    // but they're out of scope for this lint rule.
    `class MethodArgFalseNegativeTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        consumeFoo(foo) {}
        render() {
          this.consumeFoo(this.state.foo);
          return <SomeComponent />;
        }
      }`,
    `class AssignedToObjectFalseNegativeTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const obj = { foo: this.state.foo, bar: 0 };
          return <SomeComponent bar={obj.bar} />;
        }
      }`,
    `class ComputedAccessFalseNegativeTest extends React.Component {
        constructor() {
          this.state = { foo: 0, bar: 1 };
        }
        render() {
          const bar = \'bar\';
          return <SomeComponent bar={this.state[bar]} />;
        }
      }`,
    `class JsxSpreadFalseNegativeTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          return <SomeComponent {...this.state} />;
        }
      }`,
    `class AliasedJsxSpreadFalseNegativeTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const state = this.state;
          return <SomeComponent {...state} />;
        }
      }`,
    `class ObjectSpreadFalseNegativeTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const attrs = { ...this.state, foo: 1 };
          return <SomeComponent foo={attrs.foo} />;
        }
      }`,
    `class ShadowingFalseNegativeTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          const state = this.state;
          let foo;
          {
            const state = { foo: 5 };
            foo = state.foo;
          }
          return <SomeComponent foo={foo} />;
        }
      }`,
    {
      code: `class TypeCastExpressionSpreadFalseNegativeTest extends React.Component {
        constructor() {
          this.state = { foo: 0 };
        }
        render() {
          return <SomeComponent {...(this.state: any)} />;
        }
      }`,
      parser: 'babel-eslint'
    }
  ],

  invalid: [
    {
      code: `var UnusedGetInitialStateTest = createReactClass({
          getInitialState: function() {
            return { foo: 0 };
          },
          render: function() {
            return <SomeComponent />;
          }
        })`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `var UnusedGetInitialStateMethodTest = createReactClass({
          getInitialState() {
            return { foo: 0 };
          },
          render() {
            return <SomeComponent />;
          }
        })`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `var UnusedSetStateTest = createReactClass({
          onFooChange(newFoo) {
            this.setState({ foo: newFoo });
          },
          render() {
            return <SomeComponent />;
          }
        });`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class UnusedCtorStateTest extends React.Component {
          constructor() {
            this.state = { foo: 0 };
          }
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class UnusedSetStateTest extends React.Component {
          onFooChange(newFoo) {
            this.setState({ foo: newFoo });
          }
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class UnusedClassPropertyStateTest extends React.Component {
          state = { foo: 0 };
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo']),
      parser: 'babel-eslint'
    },
    {
      code: `class UnusedStateWhenPropsAreSpreadTest extends React.Component {
          constructor() {
            this.state = { foo: 0 };
          }
          render() {
            return <SomeComponent {...this.props} />;
          }
        }`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class AliasOutOfScopeTest extends React.Component {
          constructor() {
            this.state = { foo: 0 };
          }
          render() {
            const state = this.state;
            return <SomeComponent />;
          }
          someMethod() {
            const outOfScope = state.foo;
          }
        }`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class MultipleErrorsTest extends React.Component {
          constructor() {
            this.state = {
              foo: 0,
              bar: 1,
              baz: 2,
              qux: 3,
            };
          }
          render() {
            let {state} = this;
            return <SomeComponent baz={state.baz} qux={state.qux} />;
          }
        }`,
      errors: getErrorMessages(['foo', 'bar'])
    },
    {
      code: `class MultipleErrorsForSameKeyTest extends React.Component {
          constructor() {
            this.state = { foo: 0 };
          }
          onFooChange(newFoo) {
            this.setState({ foo: newFoo });
          }
          render() {
            return <SomeComponent />;
          }
        }`,
      errors: getErrorMessages(['foo', 'foo'])
    },
    {
      code: `class UnusedRestPropertyFieldTest extends React.Component {
          constructor() {
            this.state = {
              foo: 0,
              bar: 1,
            };
          }
          render() {
            const {bar, ...others} = this.state;
            return <SomeComponent bar={bar} />;
          }
        }`,
      errors: getErrorMessages(['foo'])
    },
    {
      code: `class TypeCastExpressionTest extends React.Component {
          constructor() {
            this.state = {
              foo: 0,
              bar: 1,
              baz: 2,
              qux: 3,
            };
          }
          render() {
            const foo = ((this: any).state: any).foo;
            const {bar, ...others} = (this.state: any);
            let baz;
            baz = (others: any)[\'baz\'];
            return <SomeComponent foo={foo} bar={bar} baz={baz} />;
          }
        }`,
      errors: getErrorMessages(['qux']),
      parser: 'babel-eslint'
    },
    {
      code: `class UnusedDeepDestructuringTest extends React.Component {
          state = { foo: 0, bar: 0 };
          render() {
            const {state: {foo}} = this;
            return <SomeComponent foo={foo} />;
          }
        }`,
      errors: getErrorMessages(['bar']),
      parser: 'babel-eslint'
    }
  ]
});
