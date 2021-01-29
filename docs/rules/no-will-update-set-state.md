# Prevent usage of setState in componentWillUpdate (react/no-will-update-set-state)

Updating the state during the componentWillUpdate step can lead to indeterminate component state and is not allowed.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = createReactClass({
  componentWillUpdate: function() {
     this.setState({
        name: this.props.name.toUpperCase()
      });
    },
  render: function() {
    return <div>Hello {this.state.name}</div>;
  }
});
```

Examples of **correct** code for this rule:

```jsx
var Hello = createReactClass({
  componentWillUpdate: function() {
    this.props.prepareHandler();
  },
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

```jsx
var Hello = createReactClass({
  componentWillUpdate: function() {
    this.prepareHandler(function callback(newName) {
      this.setState({
        name: newName
      });
    });
  },
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

## Rule Options

```js
...
"react/no-will-update-set-state": [<enabled>, <mode>]
...
```

### `disallow-in-func` mode

By default this rule forbids any call to `this.setState` in `componentWillUpdate` outside of functions. The `disallow-in-func` mode makes this rule more strict by disallowing calls to `this.setState` even within functions.

Examples of **incorrect** code for this rule:

```jsx
var Hello = createReactClass({
  componentWillUpdate: function() {
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
  componentWillUpdate: function() {
    this.prepareHandler(function callback(newName) {
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
