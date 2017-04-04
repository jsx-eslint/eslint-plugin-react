# Prevent usage of setState in componentDidUpdate (no-did-update-set-state)

Updating the state after a component update will trigger a second `render()` call and can lead to property/layout thrashing.

## Rule Details

The following patterns are considered warnings:

```jsx
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

```jsx
var Hello = React.createClass({
  componentDidUpdate: function() {
    this.props.onUpdate();
  },
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

```jsx
var Hello = React.createClass({
  componentDidUpdate: function() {
    this.onUpdate(function callback(newName) {
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
"no-did-update-set-state": [<enabled>, <modeInFunctions>, <modeViaMethods>]
...
```

### `disallow-in-func` mode

By default this rule forbids any call to `this.setState` in `componentDidUpdate` outside of functions. The `disallow-in-func` mode makes this rule more strict by disallowing calls to `this.setState` even within functions.

The following patterns are considered warnings:

```jsx
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

```jsx
var Hello = React.createClass({
  componentDidUpdate: function() {
    this.onUpdate(function callback(newName) {
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

### `disallow-via-methods` mode

By default this rule ignores any call to `this.setState` via methods called in `componentDidUpdate`. The `disallow-via-methods` mode makes this rule more strict by disallowing calls to `this.setState` even within methods.

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

```js
var Hello = React.createClass({
  componentDidUpdate: function() {
    this.doSomethingToState();
  },
  doSomethingToState: function() {
    this.setState({
      name: newName
    });
  },
  render: function() {
    return <div>Hello {this.state.name}</div>;
  }
});
```
