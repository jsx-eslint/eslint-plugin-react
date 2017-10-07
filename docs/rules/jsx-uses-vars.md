# Prevent variables used in JSX to be incorrectly marked as unused (react/jsx-uses-vars)

Since 0.17.0 the ESLint `no-unused-vars` rule does not detect variables used in JSX ([see details](http://eslint.org/blog/2015/03/eslint-0.17.0-released#changes-to-jsxreact-handling)). This rule will find variables used in JSX and mark them as used.

This rule only has an effect when the `no-unused-vars` rule is enabled.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = require('./Hello');
```

The following patterns are **not** considered warnings:

```jsx
var Hello = require('./Hello');

<Hello name="John" />;
```

## When Not To Use It

If you are not using JSX or if you do not use the `no-unused-vars` rule then you can disable this rule.
