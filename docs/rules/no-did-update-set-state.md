# Prevent usage of setState in componentDidUpdate (no-did-update-set-state)

Updating the state after a component update will trigger a second `render()` call and can lead to property/layout thrashing.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = React.createClass({
  componentDidUpdate: function() {
     this.setState({
        name: this.props.name.toUpperCase()
      });
    },
  render: function() {
    return <div>Hello {this.state.name}</div>;
  }
});
```

The following patterns are not considered warnings:

```js
var Hello = React.createClass({
  componentDidUpdate: function() {
    this.props.onUpdate();
  },
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```
