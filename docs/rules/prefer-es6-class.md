# Enforce ES5 or ES6 class for React Components (react/prefer-es6-class)

React offers you two ways to create traditional components: using the ES5 `create-react-class` module or the new ES6 class system. This rule allows you to enforce one way or another.

## Rule Options

```js
...
"react/prefer-es6-class": [<enabled>, <mode>]
...
```

### `always` mode

Will enforce ES6 classes for React Components. This is the default mode.

The following patterns are considered warnings:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

The following patterns are **not** considered warnings:

```jsx
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

### `never` mode

Will enforce ES5 classes for React Components.

The following patterns are considered warnings:

```jsx
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

The following patterns are **not** considered warnings:

```jsx
var Hello = createReactClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```
