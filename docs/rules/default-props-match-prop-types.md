# Enforce all defaultProps have a corresponding non-required PropType (react/default-props-match-prop-types)

This rule aims to ensure that any prop in `defaultProps` has a non-required type
definition.

> **Note**: You can provide types in runtime types using [PropTypes] and/or
statically using [TypeScript] or [Flow]. This rule will validate your prop types
regardless of how you define them.

Having `defaultProps` for non-existent prop types is likely the result of errors
in refactoring or a sign of a missing prop type. Having a `defaultProp` for a
required property similarly indicates a possible refactoring problem.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
function MyStatelessComponent({ foo, bar }) {
  return <div>{foo}{bar}</div>;
}

MyStatelessComponent.propTypes = {
  foo: React.PropTypes.string.isRequired,
  bar: React.PropTypes.string
};

MyStatelessComponent.defaultProps = {
  foo: "foo"
};
```

```jsx
var Greeting = React.createClass({
  render: function() {
    return <div>Hello {this.props.foo} {this.props.bar}</div>;
  },

  propTypes: {
    foo: React.PropTypes.string,
    bar: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      baz: "baz"
    };
  }
});
```

```jsx
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.foo} {this.props.bar}</h1>
    );
  }
}

Greeting.propTypes = {
  foo: React.PropTypes.string.isRequired,
  bar: React.PropTypes.string
};

Greeting.defaultProps = {
  foo: "foo"
};
```

```jsx
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.foo} {this.props.bar}</h1>
    );
  }

  static propTypes = {
    foo: React.PropTypes.string,
    bar: React.PropTypes.string.isRequired
  };

  static defaultProps = {
    baz: "baz"
  };
}
```

```jsx
type Props = {
  foo: string,
  bar?: string
};

function MyStatelessComponent(props: Props) {
  return <div>Hello {props.foo} {props.bar}</div>;
}

MyStatelessComponent.defaultProps = {
  foo: "foo",
  bar: "bar"
}
```

Examples of **correct** code for this rule:

```jsx
function MyStatelessComponent({ foo, bar }) {
  return <div>{foo}{bar}</div>;
}

MyStatelessComponent.propTypes = {
  foo: React.PropTypes.string,
  bar: React.PropTypes.string.isRequired
};
```

```jsx
function MyStatelessComponent({ foo, bar }) {
  return <div>{foo}{bar}</div>;
}

MyStatelessComponent.propTypes = {
  foo: React.PropTypes.string.isRequired,
  bar: React.PropTypes.string
};

MyStatelessComponent.defaultProps = {
    bar: 'some default'
};
```

```jsx
type Props = {
  foo: string,
  bar?: string
};

function MyStatelessComponent(props: Props) {
  return <div>Hello {props.foo} {props.bar}</div>;
}

MyStatelessComponent.defaultProps = {
  bar: 'some default'
};
```

```js
function NotAComponent({ foo, bar }) {}

NotAComponent.propTypes = {
  foo: React.PropTypes.string,
  bar: React.PropTypes.string.isRequired
};
```

## Rule Options

```js
...
"react/default-props-match-prop-types": [<enabled>, { "allowRequiredDefaults": <boolean> }]
...
```

### `allowRequiredDefaults`

When `true` the rule will ignore `defaultProps` for required prop types.

Examples of **correct** code for this rule, when configured with `{ "allowRequiredDefaults": true }`:

```jsx
function MyStatelessComponent({ foo, bar }) {
  return <div>{foo}{bar}</div>;
}

MyStatelessComponent.propTypes = {
  foo: React.PropTypes.string.isRequired,
  bar: React.PropTypes.string
};

MyStatelessComponent.defaultProps = {
  foo: "foo"
};
```

## When Not To Use It

If you don't care about stray `defaultsProps` in your components, you can disable this rule.

## Related rules

- [require-default-props](./require-default-props.md)

# Resources
- [Official React documentation on defaultProps](https://facebook.github.io/react/docs/typechecking-with-proptypes.html#default-prop-values)

[PropTypes]: https://reactjs.org/docs/typechecking-with-proptypes.html
[TypeScript]: http://www.typescriptlang.org/
[Flow]: https://flow.org/
