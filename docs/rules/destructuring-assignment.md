# Enforce consistent usage of destructuring assignment of props, state, and context (react/destructuring-assignment)

Rule can be set to either of `always` or `never`;
```js
"react/destructuring-assignment": [<enabled>, 'always']
```

## Rule Details

By default rule is set to `always` enforce destructuring assignment. The following patterns are considered warnings:

```js
const MyComponent = (props) => {
  return (<div id={props.id} />)
};
```

```js
const Foo = class extends React.PureComponent {
  render() {
    return <div>{this.context.foo}</div>;
  }
};
```

Below pattern is correct:

```js
const MyComponent = ({id}) => {
  return (<div id={id} />)
};
```

```js
const MyComponent = (props, context) => {
  const { id } = props;
  return (<div id={id} />)
};
```

```js
const Foo = class extends React.PureComponent {
  render() {
    const { title } = this.context;
    return <div>{title}</div>;
  }
};
```

If rule is set to `never`, the following patterns are considered warning:

```js
const MyComponent = ({id}) => {
  return (<div id={id} />)
};
```

```js
const MyComponent = (props) => {
  const { id } = props;
  return (<div id={id} />)
};
```

```js
const Foo = class extends React.PureComponent {
  render() {
    const { title } = this.state;
    return <div>{title}</div>;
  }
};
```

and below pattern is correct:

```js
const MyComponent = (props) => {
  return (<div id={props.id} />)
};
```

```js
const Foo = class extends React.PureComponent {
  render() {
    return <div>{this.state.title}</div>;
  }
};
```

## Rule Options

```js
...
"react/destructuring-assignment": [<enabled>, "always", { "ignoreClassFields": <boolean> }]
...
```

### `ignoreClassFields`

When `true` the rule will ignore class field declarations.

The following patterns are then considered okay and do not cause warnings:

```jsx
class Foo extends React.PureComponent {
  bar = this.props.bar
}
```
