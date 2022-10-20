# Lifecycle methods should be methods on the prototype, not class fields (`react/no-arrow-function-lifecycle`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

It is not necessary to use arrow function for lifecycle methods. This makes things harder to test, conceptually less performant (although in practice, performance will not be affected, since most engines will optimize efficiently), and can break hot reloading patterns.

## Rule Details

The following patterns are considered warnings:

```jsx
class Hello extends React.Component {
  render = () => {
    return <div />;
  }
}

var AnotherHello = createReactClass({
  render: () => {
    return <div />;
  },
});
```

The following patterns are **not** considered warnings:

```jsx
class Hello extends React.Component {
  render() {
    return <div />;
  }
}

var AnotherHello = createReactClass({
  render() {
    return <div />;
  },
});

```

## When Not To Use It

If you don't care about performance of your application or conceptual correctness of class property placement, you can disable this rule.
