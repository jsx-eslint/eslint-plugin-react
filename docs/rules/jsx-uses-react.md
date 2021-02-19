# Prevent React to be incorrectly marked as unused (react/jsx-uses-react)

JSX expands to a call to `React.createElement`, a file which includes `React`
but only uses JSX should consider the `React` variable as used.

If you are using the @jsx pragma this rule will mark the designated variable and not the `React` one.

This rule has no effect if the `no-unused-vars` rule is not enabled.

You can use the [shared settings](/README.md#configuration) to specify a custom pragma.

## Rule Details

Examples of **incorrect** code for this rule:

```js
var React = require('react');

// nothing to do with React
```

```jsx
/** @jsx Foo */
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

Examples of **correct** code for this rule:

```jsx
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsx Foo */
var Foo = require('foo');

var Hello = <div>Hello {this.props.name}</div>;
```

## When Not To Use It

If you are not using JSX, if React is declared as global variable or if you do not use the `no-unused-vars` rule then you can disable this rule.