# Prevent variables used in JSX to be incorrectly marked as unused (jsx-uses-vars)

Since 0.17.0 the ESLint `no-unused-vars` rule does not detect variables used in JSX ([See details](eslint.org/blog/2015/03/eslint-0.17.0-released/#changes-to-jsx/react-handling)). This rules will find varaibles used in JSX and mark them as used.

This rule has no effect if the `no-unused-vars` rule is not enabled.

## Rule Details

The following patterns are considered warnings:

```js
var Hello = require('./Hello');
```

The following patterns are not considered warnings:

```js
var Hello = require('./Hello');

<Hello name="John" />;
```

## When Not To Use It

If you are not using JSX or if you do not use the `no-unused-vars` rule then you can disable this rule.
