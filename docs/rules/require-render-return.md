# Enforce ES5 or ES6 class for returning value in render function (react/require-render-return)

When writing the `render` method in a component it is easy to forget to return the JSX content. This rule will warn if the `return` statement is missing.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = createReactClass({
  render() {
    <div>Hello</div>;
  }
});

class Hello extends React.Component {
  render() {
    <div>Hello</div>;
  }
}
```

Examples of **correct** code for this rule:

```jsx
var Hello = createReactClass({
  render() {
    return <div>Hello</div>;
  }
});

class Hello extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}
```
