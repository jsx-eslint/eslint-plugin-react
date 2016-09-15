# Prevent usage of context (no-context)

[Context](https://facebook.github.io/react/docs/context.html) is an advanced and experimental feature. The API is likely to change in future releases. Most applications will never need to use context. Especially if you are just getting started with React, you likely do not want to use context. Using context will make your code harder to understand because it makes the data flow less clear. It is similar to using global variables to pass state through your application. Consider higher order components or Flux architecture instead.

## Rule Details

The following patterns are considered warnings:

```jsx
class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}
Button.contextTypes = {
  color: React.PropTypes.string
};
```

```jsx
const Button = (props, context) =>
  <button style={{background: context.color}}>
    {props.children}
  </button>;
Button.contextTypes = {
  color: React.PropTypes.string
};
```

The following patterns are not considered warnings:

```jsx
class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}
Button.propTypes = {
  color: React.PropTypes.string
};
```

```jsx
const Button = (props) =>
  <button style={{background: props.color}}>
    {props.children}
  </button>;
Button.propTypes = {
  color: React.PropTypes.string
};
```
