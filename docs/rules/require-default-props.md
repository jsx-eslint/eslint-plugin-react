# Enforce a defaultProps definition for every prop that is not a required prop (require-default-props)

This rule aims to ensure that any non-required `PropType` declaration of a component has a corresponding `defaultProps` value.

One advantage of `defaultProps` over custom default logic in your code is that `defaultProps` are resolved by React before the `PropTypes` typechecking happens, so typechecking will also apply to your `defaultProps`.
The same also holds true for stateless functional components: default function parameters do not behave the same as `defaultProps` and thus using `defaultProps` is still preferred.

To illustrate, consider the following example:

With `defaultProps`:

```jsx
const HelloWorld = ({ name }) => (
  <h1>Hello, {name.first} {name.last}!</h1>
);

HelloWorld.propTypes = {
  name: React.PropTypes.shape({
    first: React.PropTypes.string,
    last: React.PropTypes.string,
  })
};

HelloWorld.defaultProps = {
  name: 'john'
};

// Logs:
// Invalid prop `name` of type `string` supplied to `HelloWorld`, expected `object`.
ReactDOM.render(<HelloWorld />,  document.getElementById('app'));
```

Without `defaultProps`:

```jsx
const HelloWorld = ({ name = 'John Doe' }) => (
  <h1>Hello, {name.first} {name.last}!</h1>
);

HelloWorld.propTypes = {
  name: React.PropTypes.shape({
    first: React.PropTypes.string,
    last: React.PropTypes.string,
  })
};

// Nothing is logged, renders:
// "Hello,!"
ReactDOM.render(<HelloWorld />,  document.getElementById('app'));
```

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
      foo: "foo"
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
  foo: React.PropTypes.string,
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
    foo: "foo"
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
```

The following patterns are not considered warnings:

```jsx
function MyStatelessComponent({ foo, bar }) {
  return <div>{foo}{bar}</div>;
}

MyStatelessComponent.propTypes = {
  foo: React.PropTypes.string.isRequired,
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

## When Not To Use It

If you don't care about using `defaultsProps` for your component's props that are not required, you can disable this rule.

# Resources
- [Official React documentation on defaultProps](https://facebook.github.io/react/docs/typechecking-with-proptypes.html#default-prop-values)
