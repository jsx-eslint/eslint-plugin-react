# Prevent direct mutation of this.state (no-direct-mutation-state)

NEVER mutate `this.state` directly, as calling `setState()` afterwards may replace
the mutation you made. Treat `this.state` as if it were immutable.

## Rule Details

This rule is aimed to forbid the use of mutating `this.state` directly.

The following patterns are considered warnings:

```jsx
var Hello = React.createClass({
  componentDidMount: function() {
    this.state.name = this.props.name.toUpperCase();
  },
  render: function() {
    return <div>Hello {this.state.name}</div>;
  }
});
```


The following patterns are not considered warnings:

```jsx
var Hello = React.createClass({
  componentDidMount: function() {
    this.setState({
      name: this.props.name.toUpperCase();
    });
  },
  render: function() {
    return <div>Hello {this.state.name}</div>;
  }
});
```
