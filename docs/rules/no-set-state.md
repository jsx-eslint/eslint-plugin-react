# Prevent usage of setState (no-set-state)

When using an architecture that separates your application state from your UI components (e.g. Flux), it may be desirable to forbid the use of local component state.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = React.createClass({
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

The following patterns are not considered warnings:

```js
var Hello = React.createClass({
  render: function() {
    return <div onClick={this.props.handleClick}>Hello {this.props.name}</div>;
  }
});
```
