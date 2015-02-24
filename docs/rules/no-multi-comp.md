# Prevent multiple component definition per file (no-multi-comp)

Declaring only one component per file improves readability and reusability of components.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

var HelloJohn = React.createClass({
  render: function() {
    return <Hello name="John" />;
  }
});
```

The following patterns are not considered warnings:

```js
var Hello = require('./components/Hello');

var HelloJohn = React.createClass({
  render: function() {
    return <Hello name="John" />;
  }
});
```

## When Not To Use It

If you prefer to declare multiple components per files you can disable this rule.
