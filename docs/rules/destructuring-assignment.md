# Enforce consostent usage of destructuring assignment of props, state and context (react/destructuring-assignment)

Rule can be set to either of `always`, `never`, `ignore` for SFC and to `always` or `ignore` for class components.

```js
"react/destructuring-assignment": [<enabled>, { "SFC": "always", "class": "always"}]
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
const Foo = class extends React.PureComponent {
  render() {
    const { foo } = this.props;
    return <div>{foo}</div>;
  }
};
```

If rule option is set to `never` for SFC, the following pattern is considered warning:

```js
const MyComponent = ({id}) => {
  return (<div id={id} />)
};
```

and below pattern is correct:

```js
const MyComponent = (props) => {
  return (<div id={props.id} />)
};
```
