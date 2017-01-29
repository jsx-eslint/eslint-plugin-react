# Disallow undeclared variables in JSX (jsx-no-undef)

This rule helps locate potential ReferenceErrors resulting from misspellings or missing components.

## Rule Details

The following patterns are considered warnings:

```jsx
<Hello name="John" />;
```

The following patterns are not considered warnings:

```jsx
var Hello = require('./Hello');

<Hello name="John" />;
```

## When Not To Use It

If you are not using JSX then you can disable this rule.
