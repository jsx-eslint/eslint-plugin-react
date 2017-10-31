# Prevent `this` from being used in stateless functional components (react/no-this-in-sfc)

When using a stateless functional component (SFC), props/context aren't accessed in the same way as a class component or the `create-react-class` format. Both props and context are passed as separate arguments to the component instead. Also, as the name suggests, a stateless component does not have state on `this.state`.

Attempting to access properties on `this` can be a potential error if someone is unaware of the differences when writing a SFC or missed when converting a class component to a SFC.


## Rule Details

The following patterns are considered warnings:

```jsx
function Foo(props) {
  return (
    <div>{this.props.bar}</div>
  );
}
```

```jsx
function Foo(props, context) {
  return (
    <div>
      {this.context.foo ? this.props.bar : ''}
    </div>
  );
}
```

```jsx
function Foo(props) {
  if (this.state.loading) {
    return <Loader />;
  }
  return (
    <div>
      {this.props.bar}
    </div>
  );
}
```

The following patterns are **not** considered warnings:

```jsx
function Foo(props) {
  return (
    <div>{props.bar}</div>
  );
}
```

```jsx
function Foo(props, context) {
  return (
    <div>
      {context.foo ? props.bar : ''}
    </div>
  );
}
```
