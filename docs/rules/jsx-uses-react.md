# Prevent React to be incorrectly marked as unused (react/jsx-uses-react)

JSX expands to a call to `React.createElement` or to a `React.Fragment`, a file which includes `React`
but only uses JSX should consider the `React` variable as used.

If you are using the @jsx pragma this rule will mark the designated variable and not the `React` one when you use jsx elements.

If you are using the @jsxFrag pragma this rule will mark the designated variable and not the `React` one when you use the shorthand syntax for fragments.

This rule has no effect if the `no-unused-vars` rule is not enabled.

You can use the [shared settings](/README.md#configuration) to specify a custom pragma.

## Rule Details

The following patterns are considered warnings:

```js
var React = require('react');

// nothing to do with React
```

```jsx
/** @jsx Foo */
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsxFrag Foo */
var React = require('react');

var Hello = <>Hello {this.props.name}</>;
```

```jsx
/** @jsx Foo */
var Foo = require('foo');

var Hello = <>Hello {this.props.name}</>;
```

The following patterns are **not** considered warnings:

```jsx
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsx Foo */
var Foo = require('foo');

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsxFrag Foo */
var Foo = require('foo');

var Hello = <>Hello {this.props.name}</>;
```

```jsx
/** @jsx Foo */
/** @jsxFrag React.Fragment */
var React = require('react');
var Foo = require('foo');

var Hello = <><div>Hello {this.props.name}</div></>;
```

## When Not To Use It

If you are not using JSX, if React is declared as global variable or if you do not use the `no-unused-vars` rule then you can disable this rule.
