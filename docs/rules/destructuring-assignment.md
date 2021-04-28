# Enforce consistent usage of destructuring assignment of props, state, and context (react/destructuring-assignment)

Rule can be set to either of `always` or `never`;
```js
"react/destructuring-assignment": [<enabled>, 'always']
```

## Rule Details

By default rule is set to `always` enforce destructuring assignment. Examples of **incorrect** code for this rule:

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

Examples of **incorrect** code for this rule, when configured with `"never"`:

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

When configured with `true`, the rule will ignore class field declarations. Examples of **correct** code for this rule:

```jsx
class Foo extends React.PureComponent {
  bar = this.props.bar
}
```
