# Disallow declaring unused methods of component class (react/no-unused-class-component-methods)

💼 This rule is enabled in the following [configs](https://github.com/jsx-eslint/eslint-plugin-react#shareable-configurations): `all`.

Warns you if you have defined a method or property but it is never being used anywhere.

## Rule Details

The following patterns are considered warnings:

```jsx
class Foo extends React.Component {
  handleClick() {}
  render() {
    return null;
  }
}
```

The following patterns are **not** considered warnings:

```jsx
class Foo extends React.Component {
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  action() {}
  componentDidMount() {
    this.action();
  }
  render() {
    return null;
  }
}
});
```
