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

The following patterns are not considered warnings:

```js
var Hello = React.createClass({
  displayName: 'Hello',
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

## Rule Options

```js
...
"display-name": [<enabled>, { "acceptTranspilerName": <boolean> }]
...
```

### `acceptTranspilerName`

When `true` the rule will accept the name set by the transpiler and does not require a `displayName` property in this case.

The following patterns are considered okay and do not cause warnings:

```js
var Hello = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
module.exports = Hello;
```

```js
export default class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

With the following patterns the transpiler can not assign a name for the component and therefore it will still cause warnings:

```js
module.exports = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});
```

```js
export default class extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

```js
function HelloComponent() {
  return React.createClass({
    render: function() {
      return <div>Hello {this.props.name}</div>;
    }
  });
}
module.exports = HelloComponent();
```
