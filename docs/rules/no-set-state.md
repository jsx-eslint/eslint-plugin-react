# Prevent usage of setState (react/no-set-state)

When using an architecture that separates your application state from your UI components (e.g. Flux), it may be desirable to forbid the use of local component state. This rule is especially helpful in read-only applications (that don't use forms), since local component state should rarely be necessary in such cases.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = createReactClass({
  getInitialState: function() {
    return {
      name: this.props.name
    };
  },
  handleClick: function() {
    this.setState({
      name: this.props.name.toUpperCase()
    });
  },
  render: function() {
    return <div onClick={this.handleClick.bind(this)}>Hello {this.state.name}</div>;
  }
});
```

Examples of **correct** code for this rule:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div onClick={this.props.handleClick}>Hello {this.props.name}</div>;
  }
});
```
