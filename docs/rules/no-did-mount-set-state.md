# Prevent usage of setState in componentDidMount (no-did-mount-set-state)

Updating the state after a component mount will trigger a second `render()` call and can lead to property/layout thrashing.

## Rule Details

This rule is aimed to forbid the use of `this.setState` in `componentDidMount`.

The following patterns are considered warnings:

```js
var Hello = React.createClass({
  componentDidMount: function() {
    this.setState({
      name: this.props.name.toUpperCase()
    });
  },
  render: function() {
    return <div>Hello {this.state.name}</div>;
  }
});
```

```js
var Hello = React.createClass({
  componentDidMount: function() {
    this.onMount(function callback(newName) {
      this.setState({
        name: newName
      });
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
  componentDidMount: function() {
    this.props.onMount();
  },
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

## Rule Options

```js
...
"no-did-mount-set-state": [<enabled>, <mode>]
...
```

### `allow-in-func` mode

By default this rule forbids any call to `this.setState` in `componentDidMount`. But since `componentDidMount` is a common place to set some event listeners, you may end up with calls to `this.setState` in some callbacks. The `allow-in-func` mode allows you to use `this.setState` in `componentDidMount` as long as they are called within a function.

The following patterns are considered warnings:

```js
var Hello = React.createClass({
  componentDidMount: function() {
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
  componentDidMount: function() {
    this.onMount(function callback(newName) {
      this.setState({
        name: newName
      });
    });
  },
  render: function() {
    return <div>Hello {this.state.name}</div>;
  }
});
```
