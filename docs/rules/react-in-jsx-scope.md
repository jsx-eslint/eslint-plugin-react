# Prevent errors from not requiring React when using JSX (react-in-jsx-scope)

When using JSX, `<a />` expands to `React.createElement("a")`. Therefore the
`React` variable must be in scope.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = <div>Hello {this.props.name}</div>;
```

The following patterns are not considered warnings:

```js
var React = require('react'); // or equivalent import
var Hello = <div>Hello {this.props.name}</div>;
```

## When Not To Use It

If you are setting `React` as a global variable, you will not need this rule.
