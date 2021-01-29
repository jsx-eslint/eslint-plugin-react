# Prevent missing React when using JSX (react/react-in-jsx-scope)

When using JSX, `<a />` expands to `React.createElement("a")`. Therefore the
`React` variable must be in scope.

If you are using the @jsx pragma this rule will check the designated variable and not the `React` one.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsx Foo.bar */
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

Examples of **correct** code for this rule:

```jsx
import React from 'react';

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
var React = require('react');

var Hello = <div>Hello {this.props.name}</div>;
```

```jsx
/** @jsx Foo.bar */
var Foo = require('foo');

var Hello = <div>Hello {this.props.name}</div>;
```

## When Not To Use It

If you are setting `React` as a global variable you can disable this rule.
