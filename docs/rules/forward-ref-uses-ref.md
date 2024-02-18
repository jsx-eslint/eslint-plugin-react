# Require all forwardRef components include a ref parameter (`react/forward-ref-uses-ref`)

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

Requires that components wrapped with `forwardRef` must have a `ref` parameter. Omitting the `ref` argument is usually a bug, and components not using `ref` don't need to be wrapped by `forwardRef`.

See <https://react.dev/reference/react/forwardRef>

## Rule Details

This rule checks all React components using `forwardRef` and verifies that there is a second parameter.

The following patterns are considered warnings:

```jsx
var React = require('react');

var Component = React.forwardRef((props) => (
    <div />
));
```

The following patterns are **not** considered warnings:

```jsx
var React = require('react');

var Component = React.forwardRef((props, ref) => (
    <div ref={ref} />
));

var Component = React.forwardRef((props, ref) => (
    <div />
));

var Component = (props) => (
    <div />
);
```

## When not to use

If you don't want to enforce that components using `forwardRef` utilize the forwarded ref.
