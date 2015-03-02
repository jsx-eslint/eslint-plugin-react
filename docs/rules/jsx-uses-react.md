# Prevent React to be incorrectly marked as unused (jsx-uses-react)

JSX expands to a call to `React.createElement`, a file which includes `React`
but only uses JSX should consider the `React` variable as used.

This rule has no effect if the `no-unused-vars` rule is not enabled.

## Rule Details

The following patterns are considered warnings:

```js
var React = require('react'); // and other equivalent imports

// nothing to do with React
```

The following patterns are not considered warnings:

```js
var React = require('react');

var elem = <div>Some Stuff</div>;
```

## When Not To Use It

If you are not using JSX, if React is declared as global variable or if you do not use the `no-unused-vars` rule then you can disable this rule.
