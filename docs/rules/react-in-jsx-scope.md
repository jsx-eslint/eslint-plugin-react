# Prevent missing React when using JSX (react-in-jsx-scope)

When using JSX, `<a />` expands to `React.createElement("a")`. Therefore the
`React` variable must be in scope.

If you are using the @jsx pragma this rule will check the designated variable and not the `React` one.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = <div>Hello {this.props.name}</div>;
```

```js
/** @jsx Foo.bar */
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

The following patterns are not considered warnings:

```js
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

```js
/** @jsx Foo.bar */
var Foo = require('foo');

var Hello = <div>Hello {this.props.name}</div>;
```

## When Not To Use It

If you are setting `React` as a global variable you can disable this rule.
