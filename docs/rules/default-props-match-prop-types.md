# Enforce all defaultProps have a corresponding non-required PropType (react/default-props-match-prop-types)

This rule aims to ensure that any `defaultProp` has a non-required `PropType` declaration.

Having `defaultProps` for non-existent `propTypes` is likely the result of errors in refactoring
or a sign of a missing `propType`. Having a `defaultProp` for a required property similarly
indicates a possible refactoring problem.

## Rule Details

The following patterns are considered warnings:

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

The following patterns are **not** considered warnings:

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

When `true` the rule will ignore `defaultProps` for `isRequired` `propTypes`.

The following patterns are considered okay and do not cause warnings:

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

