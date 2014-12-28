# Prevent missing displayName in a React component definition (display-name)

DisplayName allows you to name your component. This name is used by React in debugging messages.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

The following patterns are not warnings:

```js
var Hello = React.createClass({
  displayName: 'Hello',
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

## When Not To Use It

If you are using JSX this value is already automatically set and it is safe for you to disable this rule.
