# Prevent usage of setState in componentDidMount (react/no-did-mount-set-state)

Updating the state after a component mount will trigger a second `render()` call and can lead to property/layout thrashing.

## Rule Details

This rule is aimed to forbid the use of `this.setState` in `componentDidMount` outside of functions, such as callbacks.

The following patterns are considered warnings:

```jsx
var Hello = createReactClass({
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

The following patterns are **not** considered warnings:

```jsx
var Hello = createReactClass({
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

```jsx
var Hello = createReactClass({
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
"react/no-did-mount-set-state": [<enabled>, <mode>]
...
```

### `disallow-in-func` mode

By default this rule forbids any call to `this.setState` in `componentDidMount` outside of functions. The `disallow-in-func` mode makes this rule more strict by disallowing calls to `this.setState` even within functions.

The following patterns are considered warnings:

```jsx
var Hello = createReactClass({
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

```jsx
var Hello = createReactClass({
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
