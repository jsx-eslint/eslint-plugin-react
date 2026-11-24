# react/jsx-props-no-spread-multi

📝 Disallow JSX prop spreading the same identifier multiple times.

<!-- end auto-generated rule header -->

Enforces that any unique expression is only spread once.
Generally spreading the same expression twice is an indicator of a mistake since any attribute between the spreads may be overridden when the intent was not to.
Even when that is not the case this will lead to unnecessary computations being performed.

## Rule Details

Examples of **incorrect** code for this rule:

```jsx
<App {...props} myAttr="1" {...props} />
```

Examples of **correct** code for this rule:

```jsx
<App myAttr="1" {...props} />
<App {...props} myAttr="1" />
```

## When Not To Use It

You can disable this rule if [`react/jsx-props-no-spreading`](./jsx-props-no-spreading.md) already disallows all JSX prop spreading in your project.
