# Prevent `this` from being used in stateless functional components (react/no-this-in-sfc)

In React, there are two styles of component. One is a class component: `class Foo extends React.Component {...}`, which accesses its props, context, and state as properties of `this`: `this.props.foo`, etc. The other are stateless functional components (SFCs): `function Foo(props, context) {...}`. As you can see, there's no `state` (hence the name - hooks do not change this), and the props and context are provided as its two functional arguments. In an SFC, state is usually best implements with a [React hook](https://reactjs.org/docs/hooks-overview.html) such as `React.useState()`.

Attempting to access properties on `this` can sometimes be valid, but it's very commonly an error caused by unfamiliarity with the differences between the two styles of components, or a missed reference when converting a class component to an SFC.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
function Foo(props) {
  return (
    <div>{this.props.bar}</div>
  );
}
```

```jsx
function Foo(props) {
  const { bar } = this.props;
  return (
    <div>{bar}</div>
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
function Foo(props, context) {
  const { foo } = this.context;
  const { bar } = this.props;
  return (
    <div>
      {foo ? bar : ''}
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

```jsx
function Foo(props) {
  const { loading } = this.state;
  const { bar } = this.props;
  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      {bar}
    </div>
  );
}
```

Examples of **correct** code for this rule:

```jsx
function Foo(props) {
  return (
    <div>{props.bar}</div>
  );
}
```

```jsx
function Foo(props) {
  const { bar } = props;
  return (
    <div>{bar}</div>
  );
}
```

```jsx
function Foo({ bar }) {
  return (
    <div>{bar}</div>
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

```jsx
function Foo(props, context) {
  const { foo } = context;
  const { bar } = props;
  return (
    <div>
      {foo ? bar : ''}
    </div>
  );
}
```

```jsx
function Foo({ bar }, { foo }) {
  return (
    <div>
      {foo ? bar : ''}
    </div>
  );
}
```
