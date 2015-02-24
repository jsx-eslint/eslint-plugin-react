# Prevent missing parentheses around multilines JSX (wrap-multilines)

Wrapping multilines JSX in parentheses can improve readability and/or convenience.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = React.createClass({
  render: function() {
    return <div>
      <p>Hello {this.props.name}</p>
    </div>;
  }
});
```

The following patterns are not considered warnings:

```js
var singleLineJSX = <p>Hello</p>

var Hello = React.createClass({
  render: function() {
    return (
      <div>
        <p>Hello {this.props.name}</p>
      </div>
    );
  }
});
```
