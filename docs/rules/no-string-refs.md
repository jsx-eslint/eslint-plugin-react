# Prevent using string references (no-string-refs)

Currently, two ways are supported by React to refer to components. The first one, providing a string identifier is considered legacy in the official documentation. Referring to components by setting a property on the `this` object in the reference callback is preferred.

## Rule Details

Invalid:

```jsx
var Hello = React.createClass({
 render: function() {
  return <div ref="hello">Hello, world.</div>;
 }
});
```

```jsx
var Hello = React.createClass({
  componentDidMount: function() {
    var component = this.refs.hello;
    // ...do something with component
  },
  render: function() {
    return <div ref="hello">Hello, world.</div>;
  }
});
```

Valid:

```jsx
var Hello = React.createClass({
  componentDidMount: function() {
    var component = this.hello;
    // ...do something with component
  },
  render() {
    return <div ref={(c) => { this.hello = c; }}>Hello, world.</div>;
  }
});
```
